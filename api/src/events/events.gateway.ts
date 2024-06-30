import * as pty from 'node-pty';
import { ExecParams } from '~types/exec';
import { OnApplicationBootstrap } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { exec } from 'child_process';
import { Server, Socket } from 'socket.io';

function parseByLines(data: string) {
  const datas = [];
  const lines = data.trim().split(/\r?\n/);

  for (const line of lines) {
    const string = line.trim();

    if (!string) continue;
    datas.push(string);
  }
  return datas;
}

@WebSocketGateway({
  cors: { origin: '*' },
})
export class EventsGateway implements OnApplicationBootstrap {
  @WebSocketServer()
  server: Server;

  onApplicationBootstrap() {
    const command = 'docker events --format json';
    const child = exec(command);

    child.stdout.on('data', (data) => {
      const lines = data.trim().split(/\r?\n/);

      for (const line of lines) {
        const string = line.trim();

        if (!string) continue;

        for (const [, socket] of this.server.sockets.sockets) {
          try {
            socket.emit('events', JSON.parse(string));
          } catch (error) {
            console.log(error);
            console.log('ERROR JSON -->', line, '<--');
          }
        }
      }
    });
  }

  @SubscribeMessage('logs')
  handleLogs(@MessageBody() id: string, @ConnectedSocket() socket: Socket) {
    const command = `docker logs ${id} -f`;
    const child = exec(command);

    child.stdout.on('data', (data) => {
      const lines = parseByLines(data);

      for (const line of lines) {
        socket.emit('logs', { id, data: line });
      }
    });
  }

  @SubscribeMessage('exec')
  async handleExec(
    @MessageBody() { id, cols, rows }: ExecParams,
    @ConnectedSocket() socket: Socket,
  ) {
    const terminal = pty.spawn('docker', ['exec', '-it', id, '/bin/sh'], {
      name: id,
      cols,
      rows,
    });

    console.log('Command ->', `docker exec -it ${id} /bin/sh`);

    terminal.onData((data) => {
      socket.emit('exec', { id, data });
    });

    socket.on('input', (data) => terminal.write(data));
  }
}
