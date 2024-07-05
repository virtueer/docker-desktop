import * as Dockerode from "dockerode";

export type ContainerInfo = Dockerode.ContainerInfo & { loading?: boolean };
export type Compose = { name: string; containers: ContainerInfo[] };
export type GrouppedContainer = Compose | ContainerInfo;
