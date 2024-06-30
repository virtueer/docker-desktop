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
  handleEvent(@MessageBody() id: string, @ConnectedSocket() socket: Socket) {
    const command = `docker logs ${id} -f`;
    const child = exec(command);

    child.stdout.on('data', (data) => {
      const lines = parseByLines(data);

      for (const line of lines) {
        socket.emit('logs', { id, data: line });
      }
    });
  }
}
