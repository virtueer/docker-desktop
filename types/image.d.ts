import * as Dockerode from "dockerode";
import { FailResponse, StatusResponse } from "./base";

export type Image = Dockerode.ImageInfo;
export type ImageInspect = Dockerode.ImageInspectInfo;
