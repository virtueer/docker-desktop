import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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

  @Get('/image/:id')
  image(@Param('id') id: string) {
    return this.appService.image(id);
  }

  @Get('/image/name/:name')
  getImageByImageName(@Param('name') name: string) {
    return this.appService.getImageByImageName(name);
  }

  @Get('/volume')
  volumes() {
    return this.appService.volumes();
  }

  @Delete('/container/:id')
  deleteContainer(@Param('id') id: string) {
    return this.appService.deleteContainer(id);
  }

  @Get('/compose/:name')
  compose(@Param('name') name: string) {
    return this.appService.compose(name);
  }

  @Get('/compose/:name/logs')
  getComposeLogs(
    @Param('name') name: string,
    @Query('cols', new ParseIntPipe({ optional: true })) cols?: number,
    @Query('rows', new ParseIntPipe({ optional: true })) rows?: number,
  ) {
    return this.appService.getComposeLogs(name, cols, rows);
  }

  @Get('/container/:id/logs')
  getContainerLogs(@Param('id') id: string) {
    return this.appService.getContainerLogs(id);
  }

  @Get('/container/:id/inspect')
  inspectContainer(@Param('id') id: string) {
    return this.appService.inspectContainer(id);
  }
}
