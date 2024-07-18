/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as Dockerode from 'dockerode';
import { IncomingMessage } from 'http';
import * as path from 'node:path';
import { PassThrough } from 'node:stream';
import { docker } from 'src/common/docker';
import { EMIT_EVENTS } from 'src/common/emit-events';
import { StateService } from 'src/state/state.service';
import { parse } from 'stat-json';
import { File } from '~types/file';
import { Events } from '~types/events';
import { exec } from '../common/cp';

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

  statsStreams = new Map<string, IncomingMessage>();
  logsStreams = new Map<string, PassThrough>();

  logs = new Map<string, string[]>();
  composeLogs = new Map<string, string[]>();
  stats = new Map<string, Dockerode.ContainerStats[]>();

  async initialize() {
    const timeout_ms = 60_000;
    let timeout = setTimeout(() => this.updateContainers(), timeout_ms);

    this.emitter.on(EMIT_EVENTS.CONTAINERS_UPDATED, () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => this.updateContainers(), timeout_ms);
    });
  }

  async updateContainers(filters?: { [key: string]: string[] }) {
    const containers = await docker.listContainers({ all: true, filters });

    for (const container of containers) {
      this.stateService.containers.set(container.Id, container);
      this.updateContainer(container);
    }

    if (containers.length === 0 && filters?.id?.length !== 0) {
      for (const id of filters.id) {
        this.stateService.containers.delete(id);
      }
    }

    this.emitter.emit(
      EMIT_EVENTS.CONTAINERS_UPDATED,
      this.stateService.containers,
    );
  }

  async updateContainer(container: Dockerode.ContainerInfo) {
    const instance = docker.getContainer(container.Id);
    this.watchStats(instance, container.State !== 'running');
    this.watchLogs(instance, container);
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

  async watchLogs(
    instance: Dockerode.Container,
    container: Dockerode.ContainerInfo,
  ) {
    const compose = container.Labels['com.docker.compose.project'];

    const oldStream = this.logsStreams.get(container.Id);
    if (oldStream) return;

    const options: Parameters<typeof instance.logs>[0] = {
      details: false,
      follow: true,
      timestamps: true,
      stdout: true,
      stderr: false,
    };

    const stream = (await instance.logs(options)) as IncomingMessage;
    this.statsStreams.set(instance.id, stream);
    this.logs.set(instance.id, []);
    if (compose) {
      this.composeLogs.set(compose, []);
    }

    function cacheLog(logs: string[], log: string) {
      if (logs.length === 100_000) {
        logs.shift();
      }

      logs.push(log);
    }

    const logStream = new PassThrough();
    logStream.on('data', (chunk: Buffer) => {
      const log = chunk.toString();
      const logs = this.logs.get(instance.id);
      cacheLog(logs, log);

      this.emitter.emit(EMIT_EVENTS.CONTAINER_LOGS, { container, log });

      if (compose) {
        const logs = this.composeLogs.get(compose);
        cacheLog(logs, log);

        this.emitter.emit(EMIT_EVENTS.COMPOSE_LOGS, {
          compose,
          container,
          log,
        });
      }
    });

    this.logsStreams.set(container.Id, logStream);

    instance.modem.demuxStream(stream, logStream, logStream);
  }

  async onEvent(event: Events) {
    await new Promise((r) => setTimeout(r, 1000));
    this.updateContainers({ id: [event.id] });
  }

  async listContainers() {
    return Array.from(this.stateService.containers.values());
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

    this.stateService.loadings.add(container.Id);

    this.emitter.emit(
      EMIT_EVENTS.CONTAINERS_UPDATED,
      this.stateService.containers,
    );

    const instance = docker.getContainer(id);
    await instance.stop();

    this.stateService.loadings.delete(container.Id);

    this.emitter.emit(
      EMIT_EVENTS.CONTAINERS_UPDATED,
      this.stateService.containers,
    );

    return { status: true };
  }

  async startContainer(id: string) {
    const container = this.stateService.containers.get(id);
    if (!container) {
      return { status: false, error: 'Not found' };
    }

    this.stateService.loadings.add(container.Id);

    this.emitter.emit(
      EMIT_EVENTS.CONTAINERS_UPDATED,
      this.stateService.containers,
    );

    const instance = docker.getContainer(id);
    await instance.start();

    this.stateService.loadings.delete(container.Id);

    this.emitter.emit(
      EMIT_EVENTS.CONTAINERS_UPDATED,
      this.stateService.containers,
    );

    return { status: true };
  }

  async pauseContainer(id: string) {
    const container = this.stateService.containers.get(id);
    if (!container) {
      return { status: false, error: 'Not found' };
    }

    this.stateService.loadings.add(container.Id);

    this.emitter.emit(
      EMIT_EVENTS.CONTAINERS_UPDATED,
      this.stateService.containers,
    );

    const instance = docker.getContainer(id);
    await instance.pause();

    this.stateService.loadings.delete(container.Id);

    this.emitter.emit(
      EMIT_EVENTS.CONTAINERS_UPDATED,
      this.stateService.containers,
    );

    return { status: true };
  }

  async unpauseContainer(id: string) {
    const container = this.stateService.containers.get(id);
    if (!container) {
      return { status: false, error: 'Not found' };
    }

    this.stateService.loadings.add(container.Id);

    this.emitter.emit(
      EMIT_EVENTS.CONTAINERS_UPDATED,
      this.stateService.containers,
    );

    const instance = docker.getContainer(id);
    await instance.unpause();

    this.stateService.loadings.delete(container.Id);

    this.emitter.emit(
      EMIT_EVENTS.CONTAINERS_UPDATED,
      this.stateService.containers,
    );

    return { status: true };
  }

  async restartContainer(id: string) {
    const container = this.stateService.containers.get(id);
    if (!container) {
      return { status: false, error: 'Not found' };
    }

    this.stateService.loadings.add(container.Id);

    this.emitter.emit(
      EMIT_EVENTS.CONTAINERS_UPDATED,
      this.stateService.containers,
    );

    const instance = docker.getContainer(id);
    await instance.restart();

    this.stateService.loadings.delete(container.Id);

    this.emitter.emit(
      EMIT_EVENTS.CONTAINERS_UPDATED,
      this.stateService.containers,
    );

    return { status: true };
  }

  async deleteContainer(id: string) {
    const container = this.stateService.containers.get(id);
    if (!container) {
      return { status: false, error: 'Not found' };
    }

    this.stateService.loadings.add(container.Id);

    this.emitter.emit(
      EMIT_EVENTS.CONTAINERS_UPDATED,
      this.stateService.containers,
    );

    const instance = docker.getContainer(id);
    await instance.remove({ force: true });

    this.stateService.loadings.delete(container.Id);

    this.emitter.emit(
      EMIT_EVENTS.CONTAINERS_UPDATED,
      this.stateService.containers,
    );

    return { status: true };
  }

  async getFiles(id: string, dest = '/') {
    const dest_path = path.posix.normalize(dest + '/');
    const command = `docker exec ${id} sh -c "ls -a ${dest_path} | xargs -I {} stat ${dest_path}{} || true"`;
    const { stderr, stdout } = await exec(command);

    if (stderr && !stdout) {
      console.log('stderr', stderr, '---');
      return { status: false, error: stderr };
    }

    return {
      status: true,
      data: parse(stdout, dest_path)
        .filter((x) => !['..', '.'].includes(x.name))
        .map((x) => ({
          ...x,
          path: path.posix.resolve(dest_path, x.name),
          dir: path.posix.resolve(dest_path),
        })) as File[],
    };
  }
}
