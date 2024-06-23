export type Events = StartContainerAction | StopContainerAction;

export type StartContainerAction = { Action: "start" } & ContainerAction;
export type StopContainerAction = { Action: "stop" } & ContainerAction;

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
