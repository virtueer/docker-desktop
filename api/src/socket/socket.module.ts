import { Module } from '@nestjs/common';
import { ContainerModule } from 'src/container/container.module';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [ContainerModule],
  providers: [SocketGateway],
})
export class SocketModule {}
