export type Events =
  | StartContainerAction
  | StopContainerAction
  | PauseContainerAction
  | UnpauseContainerAction
  | DestroyContainerAction
  | CreateContainerAction;

export type StartContainerAction = { Action: "start" } & ContainerAction;
export type StopContainerAction = { Action: "stop" } & ContainerAction;
export type PauseContainerAction = { Action: "pause" } & ContainerAction;
export type UnpauseContainerAction = { Action: "unpause" } & ContainerAction;
export type DestroyContainerAction = { Action: "destroy" } & ContainerAction;
export type CreateContainerAction = { Action: "create" } & ContainerAction;

export interface ContainerAction {
  Actor: Actor;
  Type: "container";
  from: string;
  id: string;
  scope: "local";
  status: "start";
  time: number;
  timeNano: number;
}

export interface Actor {
  ID: string;
  Attributes: Attributes;
}

export interface Attributes {
  image: string;
  name: string;
  "com.docker.compose.config-hash"?: string;
  "com.docker.compose.container-number"?: string;
  "com.docker.compose.depends_on"?: string;
  "com.docker.compose.image"?: string;
  "com.docker.compose.oneoff"?: string;
  "com.docker.compose.project"?: string;
  "com.docker.compose.project.config_files"?: string;
  "com.docker.compose.project.working_dir"?: string;
  "com.docker.compose.service"?: string;
  "com.docker.compose.version"?: string;
  signal?: string;
  maintainer?: string;
}
