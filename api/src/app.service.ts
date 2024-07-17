import { Injectable } from '@nestjs/common';
import { docker } from './common/docker';

@Injectable()
export class AppService {
  async images() {
    return docker.listImages({ all: true });
  }

  async image(id: string) {
    return docker.getImage(id).inspect();
  }

  async volumes() {
    return docker.listVolumes({});
  }
}
