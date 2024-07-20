import { forwardRef, Inject, Injectable } from '@nestjs/common';
import Dockerode from 'dockerode';
import { ImageInspect } from '~types/image';
import { docker } from './common/docker';
import { StateService } from './state/state.service';

@Injectable()
export class AppService {
  @Inject(forwardRef(() => StateService))
  private readonly stateService: StateService;

  async images() {
    return docker.listImages({ all: true });
  }

  async image(id: string) {
    return docker.getImage(id).history() as Promise<ImageInspect[]>;
  }

  async volumes() {
    return docker.listVolumes({});
  }

  async usage() {
    const calculateCPUPercentage = (data: Dockerode.ContainerStats) => {
      const cpu_delta =
        data.cpu_stats.cpu_usage.total_usage -
        data.precpu_stats.cpu_usage.total_usage;
      const system_cpu_delta =
        data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
      const number_cpus = data.cpu_stats.online_cpus;
      const result = (cpu_delta / system_cpu_delta) * number_cpus * 100.0;

      return result || 0;
    };

    const calculateMemoryUsage = (data: Dockerode.ContainerStats) =>
      data.memory_stats.usage - data.memory_stats.stats.cache;

    let total_cpu_usage = 0;
    let total_memory_usage = 0;

    for (const [_, stats] of this.stateService.stats) {
      const last_stat = stats[stats.length - 1];
      if (!last_stat) continue;

      const memory_usage = calculateMemoryUsage(last_stat);
      const cpu_usage = calculateCPUPercentage(last_stat);

      total_cpu_usage += cpu_usage || 0;
      total_memory_usage += memory_usage;
    }

    return {
      total_cpu_usage,
      total_memory_usage: total_memory_usage,
    };
  }

  async info() {
    return this.stateService.info;
  }
}
