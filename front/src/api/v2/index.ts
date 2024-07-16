import { FailResponse, StatusResponse } from "~types/base";
import { ContainerInfo } from "~types/v2/container/list";

export type ApiRoutes = {
  container: {
    list: ContainerInfo[];
    stop: StatusResponse | FailResponse;
    start: StatusResponse | FailResponse;
    pause: StatusResponse | FailResponse;
    unpause: StatusResponse | FailResponse;
    restart: StatusResponse | FailResponse;
  };
};
