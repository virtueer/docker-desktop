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
import { docker } from 'src/common/docker';
import {
  EMIT_EVENTS,
  EMIT_EVENTS_PARAMS,
  SOCKET_EVENTS,
} from 'src/common/emit-events';
import { ContainerService } from 'src/container/container.service';
import { StateService } from 'src/state/state.service';
import { PassThrough } from 'stream';
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
    @MessageBody() { name }: { name: string },
  ) {
    const handler = ({ compose, log }: EMIT_EVENTS_PARAMS['COMPOSE_LOGS']) => {
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

  @SubscribeMessage('container logs')
  subscribeContainerLogs(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { id }: { id: string },
  ) {
    const prefix = `container logs ${id}`;

    function handle({ container, log }: EMIT_EVENTS_PARAMS['CONTAINER_LOGS']) {
      if (container.Id !== id) {
        return;
      }

      socket.emit(prefix, { log });
    }

    const onStop = () => {
      this.emitter.off(EMIT_EVENTS.CONTAINER_LOGS, handle);
      socket.off('disconnect', onDisconnect);
    };

    const onDisconnect = () => {
      this.emitter.off(EMIT_EVENTS.CONTAINER_LOGS, handle);
      socket.off(`stop ${prefix}`, onStop);
    };

    const logs = this.containerService.logs.get(id);
    for (let i = 0; i < logs.length; i++) {
      socket.emit(`container logs ${id}`, { log: `${i} ${logs[i]}` });
    }

    socket.once(`stop ${prefix}`, onStop);
    socket.once('disconnect', onDisconnect);
    this.emitter.on(EMIT_EVENTS.CONTAINER_LOGS, handle);
  }

  @SubscribeMessage('container exec')
  async start(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    { id, cols, rows }: { id: string; cols: number; rows: number },
  ) {
    const instance = docker.getContainer(id);

    const shell = await instance.exec({
      Cmd: ['/bin/sh'],
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
    });

    const stream = await shell.start({
      hijack: true,
      stdin: true,
    });

    await shell.resize({ w: cols, h: rows });

    const stdout = new PassThrough();
    stdout.setEncoding('utf-8');

    stdout.on('data', (data) =>
      socket.emit(`container exec logs ${id}`, { data }),
    );

    docker.modem.demuxStream(stream, stdout, stdout);

    const onDisconnect = () => {
      stream.write('exit\n');
      socket.off(`container exec stop ${id}`, onStop);
      socket.off(`container exec input ${id}`, onInput);
    };

    const onStop = () => {
      stream.write('exit\n');
      socket.off('disconnect', onDisconnect);
      socket.off(`container exec input ${id}`, onInput);
    };

    const onInput = (data: string) => {
      stream.write(data);
    };

    socket.once('disconnect', onDisconnect);
    socket.once(`container exec stop ${id}`, onStop);
    socket.on(`container exec input ${id}`, onInput);
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
