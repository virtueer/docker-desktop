import { forwardRef, Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { exec } from 'child_process';
import * as pty from 'node-pty';
import { Server, Socket } from 'socket.io';
import { groupContainers } from 'src/common/group-containers';
import { StateService } from 'src/state/state.service';
import { ExecParams } from '~types/exec';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EMIT_EVENTS, SOCKET_EVENTS } from 'src/common/emit-events';

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
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @Inject(EventEmitter2)
  private readonly emitter: EventEmitter2;

  @Inject(forwardRef(() => StateService))
  private readonly stateService: StateService;

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    const groupped = groupContainers([
      ...this.stateService.containers.values(),
    ]);

    socket.emit('containers', groupped);

    const handler = () => {
      console.log(
        'handled',
        this.server.sockets.sockets.size,
        this.emitter.listenerCount(EMIT_EVENTS.CONTAINERS_UPDATED),
      );

      const groupped = groupContainers([
        ...this.stateService.containers.values(),
      ]);

      socket.emit(SOCKET_EVENTS.CONTAINERS_UPDATED, groupped);
    };

    socket.on('disconnect', () => {
      this.emitter.off(EMIT_EVENTS.CONTAINERS_UPDATED, handler);
    });

    this.emitter.on(EMIT_EVENTS.CONTAINERS_UPDATED, handler);
  }

  async handleDisconnect() {}

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
