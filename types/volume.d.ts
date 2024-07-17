import { FailResponse } from "./base";
import * as Dockerode from "dockerode";

export type Volume = Dockerode.VolumeInspectInfo & { CreatedAt: string };
