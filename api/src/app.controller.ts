import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  @Inject(AppService)
  private appService: AppService;

  @Get('/ps')
  getAllPs() {
    return this.appService.getAllPs();
  }

  @Get('/ps/:id')
  getPs(@Param('id') id: string) {
    return this.appService.getPs(id);
  }

  @Delete('/ps/:id')
  stopPs(@Param('id') id: string) {
    return this.appService.stopPs(id);
  }

  @Put('/ps/:id/pause')
  pausePs(@Param('id') id: string) {
    return this.appService.pausePs(id);
  }

  @Put('/ps/:id/unpause')
  unPausePs(@Param('id') id: string) {
    return this.appService.unPausePs(id);
  }

  @Post('/ps/:id')
  startPs(@Param('id') id: string) {
    return this.appService.startPs(id);
  }

  @Get('/image')
  images() {
    return this.appService.images();
  }
}
