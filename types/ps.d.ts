export interface StatusResponse {
  status: boolean;
}
export type GetDockerAllPsResponse =
  | GetDockerAllPsResponseSuccess
  | FailResponse;

export interface FailResponse extends StatusResponse {
  status: false;
  error: string;
}

export interface GetDockerAllPsResponseSuccess extends StatusResponse {
  status: true;
  data: DockerPs[];
}

export type GetDockerPsResponse =
  | GetDockerPsResponseSuccess
  | GetDockerPsResponseFail;

export interface GetDockerPsResponseFail extends StatusResponse {
  status: false;
  error: string;
}

export interface GetDockerPsResponseSuccess extends StatusResponse {
  status: true;
  data: DockerPs;
}

export interface Compose {
  name: string;
  containers: DockerPs[];
}

export interface DockerPs {
  Command: string;
  CreatedAt: string;
  ID: string;
  Image: string;
  Labels: DockerPsLabels;
  LocalVolumes: string;
  Mounts: string;
  Names: string;
  Networks: string;
  Ports: string;
  RunningFor: string;
  Size: string;
  State: string;
  Status: string;
}

export interface DockerPsLabels {
  [x: string]: string;
  "com.docker.compose.image": string;
  "com.docker.compose.service": string;
  "com.docker.compose.version": string;
  "com.docker.compose.container-number": string;
  "com.docker.compose.project": string;
  "com.docker.compose.project.config_files": string;
  "com.docker.compose.project.working_dir": string;
  "com.docker.compose.config-hash": string;
}
