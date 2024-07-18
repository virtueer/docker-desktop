import { Injectable } from '@nestjs/common';
import { ImageInspect } from '~types/image';
import { docker } from './common/docker';

@Injectable()
export class AppService {
  async images() {
    return docker.listImages({ all: true });
  }

  async image(id: string) {
    return docker.getImage(id).history() as Promise<ImageInspect[]>;
  }

  async volumes() {
    return docker.listVolumes({});
  }
}
