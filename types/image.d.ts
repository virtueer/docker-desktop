import * as Dockerode from "dockerode";
import { FailResponse, StatusResponse } from "./base";

export type Image = Dockerode.ImageInfo;

export interface ImageInspect {
  Comment: string;
  Created: number;
  CreatedBy: string;
  Id: string;
  Size: number;
  Tags: any;
}
