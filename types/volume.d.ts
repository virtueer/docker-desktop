import { FailResponse } from "./base";

export type GetVolumesResponse = GetVolumesResponseSuccess | FailResponse;

export interface GetVolumesResponseSuccess {
  status: true;
  data: Volume[];
}

export interface Volume {
  Availability: string;
  Driver: string;
  Group: string;
  Labels: string;
  Links: string;
  Mountpoint: string;
  Name: string;
  Scope: string;
  Size: string;
  Status: string;
}
