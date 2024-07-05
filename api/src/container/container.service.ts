/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as Dockerode from 'dockerode';
import { IncomingMessage } from 'http';
import { PassThrough } from 'node:stream';
import { docker } from 'src/common/docker';
import { StateService } from 'src/state/state.service';
import { Events } from '~types/v2/events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EMIT_EVENTS } from 'src/common/emit-events';

@Injectable()
export class ContainerService implements OnModuleInit {
  @Inject(EventEmitter2)
  private readonly emitter: EventEmitter2;

  @Inject(forwardRef(() => StateService))
  private readonly stateService: StateService;

  async onModuleInit() {
    await this.updateContainers();

    this.initialize();
  }

  inspects = new Map<string, any>();
  statsStreams = new Map<string, IncomingMessage>();
  logsStreams = new Map<string, IncomingMessage>();

  logs = new Map<string, string[]>();
  stats = new Map<string, Dockerode.ContainerStats[]>();

  async initialize() {}

  async updateContainers(filters?: { [key: string]: string[] }) {
    const containers = await docker.listContainers({ all: true, filters });

    for (const container of containers) {
      this.stateService.containers.set(container.Id, container);
      this.updateContainer(container);
    }

    this.emitter.emit(
      EMIT_EVENTS.CONTAINERS_UPDATED,
      this.stateService.containers,
    );
  }

  async updateContainer(container: Dockerode.ContainerInfo) {
    const instance = docker.getContainer(container.Id);
    this.updateInspect(instance);
    this.watchStats(instance, container.State !== 'running');
    this.watchLogs(instance);
  }

  async updateInspect(container: Dockerode.Container) {
    const inspect = await container.inspect();
    this.inspects.set(container.id, inspect);
  }

  async watchStats(container: Dockerode.Container, watch: boolean) {
    const oldStream = this.statsStreams.get(container.id);
    oldStream?.destroy();
    this.statsStreams.delete(container.id);

    if (watch) return;

    const stream = (await container.stats({ stream: true })) as IncomingMessage;
    this.statsStreams.set(container.id, stream);

    const oldStats = this.stats.get(container.id);
    if (!oldStats) {
      this.stats.set(container.id, []);
    }

    stream.on('data', (buffer: Buffer) => {
      const stats = this.stats.get(container.id);

      // last 30 day
      if (stats.length === 2_592_000) {
        stats.shift();
      }

      stats.push(JSON.parse(buffer.toString().trim()));
    });
  }

  async watchLogs(container: Dockerode.Container) {
    const oldStream = this.logsStreams.get(container.id);
    if (oldStream) return;

    const options: Parameters<typeof container.logs>[0] = {
      details: false,
      follow: true,
      timestamps: true,
      stdout: true,
      stderr: false,
    };

    const stream = (await container.logs(options)) as IncomingMessage;
    this.statsStreams.set(container.id, stream);
    this.logs.set(container.id, []);

    const logStream = new PassThrough();
    logStream.on('data', (chunk: Buffer) => {
      const logs = this.logs.get(container.id);

      // last 100_000 lines
      if (logs.length === 100_000) {
        logs.shift();
      }

      logs.push(chunk.toString());
    });

    container.modem.demuxStream(stream, logStream, logStream);
  }

  async onEvent(event: Events) {
    console.log('CONTAINER ON EVENT', event);
    await new Promise((r) => setTimeout(r, 1000));
    this.updateContainers({ id: [event.id] });
  }

  async listContainers() {
    return Array.from(this.stateService.containers.values());
    // const containers = await docker.listContainers({
    //   all: true,
    // });
    // return containers;
  }

  async getContainer(id: string) {
    const container = await docker.getContainer(id);
    return container.inspect();
  }

  async getContainerLogs(id: string) {
    const logs = this.logs.get(id);
    return { length: logs.length, logs };
  }

  async getContainerStats(id: string) {
    const stats = this.stats.get(id);
    return { length: stats.length, stats };
  }

  async stopContainer(id: string) {
    const container = this.stateService.containers.get(id);
    if (!container) {
      return { status: false, error: 'Not found' };
    }

    const instance = docker.getContainer(id);

    container.loading = true;

    this.emitter.emit(
      EMIT_EVENTS.CONTAINERS_UPDATED,
      this.stateService.containers,
    );

    await new Promise((r) => setTimeout(r, 5000));

    container.loading = undefined;

    this.emitter.emit(
      EMIT_EVENTS.CONTAINERS_UPDATED,
      this.stateService.containers,
    );

    return;
  }
}
