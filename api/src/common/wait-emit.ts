import { EventEmitter2 } from '@nestjs/event-emitter';

export function waitEmit<T>(emitter: EventEmitter2, name: string) {
  return new Promise<T>((resolve) => emitter.once(name, resolve));
}
