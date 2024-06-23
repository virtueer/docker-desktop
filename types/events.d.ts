export type Events =
  | StartContainerAction
  | StopContainerAction
  | PauseContainerAction
  | UnpauseContainerAction;

export type StartContainerAction = { Action: "start" } & ContainerAction;
export type StopContainerAction = { Action: "stop" } & ContainerAction;
export type PauseContainerAction = { Action: "pause" } & ContainerAction;
export type UnpauseContainerAction = { Action: "unpause" } & ContainerAction;

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
}
