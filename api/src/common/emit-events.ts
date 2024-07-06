import { ContainerInfo } from '~types/v2/container/list';

export enum EMIT_EVENTS {
  CONTAINERS_UPDATED = 'CONTAINERS_UPDATED',
  COMPOSE_LOGS = 'COMPOSE_LOGS',
  CONTAINER_LOGS = 'CONTAINER_LOGS',
}

export type EMIT_EVENTS_PARAMS = {
  [EMIT_EVENTS.CONTAINERS_UPDATED]: { containers: ContainerInfo[] };
  [EMIT_EVENTS.COMPOSE_LOGS]: {
    compose: string;
    container: ContainerInfo;
    log: string;
  };
  [EMIT_EVENTS.CONTAINER_LOGS]: {
    container: ContainerInfo;
    log: string;
  };
};

export enum SOCKET_EVENTS {
  CONTAINERS_UPDATED = 'containers',
}
