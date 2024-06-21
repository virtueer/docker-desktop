import { Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  @Inject(AppService)
  private appService: AppService;

  @Get('/ps')
  getPs() {
    return this.appService.getPs();
  }

  @Post('/ps/stop')
  stopPs(@Query('id') id: string) {
    return this.appService.stopPs(id);
  }
}
