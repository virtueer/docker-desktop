import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { StateModule } from './state/state.modeule';
import { ContainerModule } from './container/container.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'front', 'dist'), // dirname = api/dist,
    }),
    EventEmitterModule.forRoot(),
    SocketModule,
    StateModule,
    ContainerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
