import { Inject, Injectable, OnModuleInit, forwardRef } from '@nestjs/common';
import { docker } from 'src/common/docker';
import { ContainerService } from 'src/container/container.service';
import { ContainerInfo } from '~types/v2/container/list';
import { Events } from '~types/v2/events';

@Injectable()
export class StateService implements OnModuleInit {
  @Inject(forwardRef(() => ContainerService))
  private readonly containerService: ContainerService;

  containers = new Map<string, ContainerInfo>();

  onModuleInit() {
    this.initialize();
  }

  async initialize() {
    const events = await docker.getEvents();

    events.on('data', (buffer) => {
      const data_str = buffer.toString().trim();
      const data = JSON.parse(data_str) as Events;

      if (data.Type === 'container') {
        this.containerService.onEvent(data);
      }
    });
  }
}
