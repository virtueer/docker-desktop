import { Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ContainerService } from './container.service';

@Controller('/v2/container')
export class ContainerController {
  @Inject(ContainerService)
  private readonly containerService: ContainerService;

  @Get('/list')
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

  @Post('/:id/stop')
  async stopContainer(@Param('id') id: string) {
    return this.containerService.stopContainer(id);
  }

  @Post('/:id/start')
  async startContainer(@Param('id') id: string) {
    return this.containerService.startContainer(id);
  }
}
