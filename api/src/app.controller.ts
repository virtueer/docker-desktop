import { Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
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

  @Post('/ps/:id')
  startPs(@Param('id') id: string) {
    return this.appService.startPs(id);
  }
}
