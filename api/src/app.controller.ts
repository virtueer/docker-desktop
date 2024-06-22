import { Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
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

  @Post('/ps/stop')
  stopPs(@Query('id') id: string) {
    return this.appService.stopPs(id);
  }
}
