import { forwardRef, Inject, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
import {
  EMIT_EVENTS,
  EMIT_EVENTS_PARAMS,
  SOCKET_EVENTS,
} from 'src/common/emit-events';
import { ContainerService } from 'src/container/container.service';
import { StateService } from 'src/state/state.service';
import { ExecParams } from '~types/exec';

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
export class SocketGateway
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  @Inject(EventEmitter2)
  private readonly emitter: EventEmitter2;

  @Inject(forwardRef(() => StateService))
  private readonly stateService: StateService;

  @Inject(forwardRef(() => ContainerService))
  private readonly containerService: ContainerService;

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    // this.emitter.on(EMIT_EVENTS.COMPOSE_LOGS, ({ compose, container, log }) => {
    //   console.log(compose, container.Id, log.length);
    // });
  }

  async handleConnection(socket: Socket) {
    const emitContainers = () => {
      socket.emit(
        SOCKET_EVENTS.CONTAINERS_UPDATED,
        this.stateService.getGroupedContainers(),
      );
    };

    socket.on('disconnect', () => {
      this.emitter.off(EMIT_EVENTS.CONTAINERS_UPDATED, emitContainers);
    });

    this.emitter.on(EMIT_EVENTS.CONTAINERS_UPDATED, emitContainers);

    emitContainers();
  }

  async handleDisconnect() {}

  @SubscribeMessage('compose logs')
  subscribeComposeLogs(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { name }: any,
  ) {
    const handler = ({ compose, log }: EMIT_EVENTS_PARAMS['COMPOSE_LOGS']) => {
      console.log('handled');
      if (compose !== name) {
        return;
      }

      socket.on(`stop compose logs ${name}`, () => {
        this.emitter.off(EMIT_EVENTS.COMPOSE_LOGS, handler);
      });

      socket.on('disconnect', () => {
        this.emitter.off(EMIT_EVENTS.COMPOSE_LOGS, handler);
      });

      socket.emit(`compose logs ${compose}`, { log });
    };

    const logs = this.containerService.composeLogs.get(name);
    for (const log of logs) {
      socket.emit(`compose logs ${name}`, { log });
    }

    this.emitter.on(EMIT_EVENTS.COMPOSE_LOGS, handler);
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
