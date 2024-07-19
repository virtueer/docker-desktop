import { FailResponse, StatusResponse } from "~types/base";
import {
  ContainerInfo,
  ContainerInspect,
  ContainerStats,
} from "~types/container";
import { Image, ImageInspect } from "~types/image";
import { Volume } from "~types/volume";

export type ApiRoutes = {
  container: {
    list: ContainerInfo[];
    stop: StatusResponse | FailResponse;
    start: StatusResponse | FailResponse;
    pause: StatusResponse | FailResponse;
    unpause: StatusResponse | FailResponse;
    restart: StatusResponse | FailResponse;
    delete: StatusResponse | FailResponse;
    inspect: ContainerInspect;
    stats: { length: number; stats: ContainerStats[] };
  };
  image: {
    list: Image[];
    info: ImageInspect[];
  };
  volume: {
    list: { Volumes: Volume[]; Warnings: string[] };
  };
};
