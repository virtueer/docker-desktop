import { Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { ContainerService } from './container.service';

@Controller('/container')
export class ContainerController {
  @Inject(ContainerService)
  private readonly containerService: ContainerService;

  @Get('/')
  async listContainer() {
    return this.containerService.listContainers();
  }

  @Get('/:id')
  async getContainer(@Param('id') id: string) {
    return this.containerService.getContainer(id);
  }

  @Get('/:id/logs')
  async getContainerLogs(@Param('id') id: string) {
    return this.containerService.getContainerLogs(id);
  }

  @Get('/:id/stats')
  async getContainerStats(@Param('id') id: string) {
    return this.containerService.getContainerStats(id);
  }

  @Get('/:id/files')
  getFiles(@Param('id') id: string, @Query('path') path: string) {
    return this.containerService.getFiles(id, path);
  }

  @Post('/:id/stop')
  async stopContainer(@Param('id') id: string) {
    return this.containerService.stopContainer(id);
  }

  @Post('/:id/start')
  async startContainer(@Param('id') id: string) {
    return this.containerService.startContainer(id);
  }

  @Post('/:id/pause')
  async pauseContainer(@Param('id') id: string) {
    return this.containerService.pauseContainer(id);
  }

  @Post('/:id/unpause')
  async unpauseContainer(@Param('id') id: string) {
    return this.containerService.unpauseContainer(id);
  }

  @Post('/:id/restart')
  async restartContainer(@Param('id') id: string) {
    return this.containerService.restartContainer(id);
  }

  @Post('/:id/delete')
  async deleteContainer(@Param('id') id: string) {
    return this.containerService.deleteContainer(id);
  }
}
