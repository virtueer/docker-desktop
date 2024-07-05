import { Global, Module } from '@nestjs/common';
import { StateService } from './state.service';
import { ContainerModule } from 'src/container/container.module';

@Global()
@Module({
  imports: [ContainerModule],
  providers: [StateService],
  exports: [StateService],
})
export class StateModule {}
