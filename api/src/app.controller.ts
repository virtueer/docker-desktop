import { Controller, Get, Inject, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  @Inject(AppService)
  private appService: AppService;

  @Get('/image')
  images() {
    return this.appService.images();
  }

  @Get('/image/:id')
  image(@Param('id') id: string) {
    return this.appService.image(id);
  }

  @Get('/volume')
  volumes() {
    return this.appService.volumes();
  }

  @Get('/info')
  info() {
    return this.appService.info();
  }

  @Get('/usage')
  usage() {
    return this.appService.usage();
  }
}
