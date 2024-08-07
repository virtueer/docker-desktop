import { Inject, Injectable, OnModuleInit, forwardRef } from '@nestjs/common';
import { docker } from 'src/common/docker';
import { groupContainers } from 'src/common/group-containers';
import { ContainerService } from 'src/container/container.service';
import { ContainerInfo } from '~types/container';
import { Events } from '~types/events';
import { DockerInfo } from '~types/info';
import * as Dockerode from 'dockerode';

@Injectable()
export class StateService implements OnModuleInit {
  @Inject(forwardRef(() => ContainerService))
  private readonly containerService: ContainerService;

  containers = new Map<string, ContainerInfo>();
  loadings = new Set<string>();
  stats = new Map<string, Dockerode.ContainerStats[]>();
  info: DockerInfo;

  onModuleInit() {
    this.initialize();
  }

  async initialize() {
    this.info = await docker.info();
    const events = await docker.getEvents();

    events.on('data', (buffer) => {
      const data_str = buffer.toString().trim();
      const data = JSON.parse(data_str) as Events;

      if (data.Type === 'container') {
        this.containerService.onEvent(data);
      }
    });
  }

  getGroupedContainers() {
    const containers = [...this.containers.values()].map((x) => ({
      ...x,
      loading: this.loadings.has(x.Id),
    }));

    const groupped = groupContainers(containers);

    return groupped;
  }
}
