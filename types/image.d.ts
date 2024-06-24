import { FailResponse } from "./ps";

export type GetImagesResponse = GetImagesResponseSuccess | FailResponse;

export interface GetImagesResponseSuccess {
  status: true;
  data: Image[];
}

export interface Image {
  Containers: string;
  CreatedAt: string;
  CreatedSince: string;
  Digest: string;
  ID: string;
  Repository: string;
  SharedSize: string;
  Size: string;
  Tag: string;
  UniqueSize: string;
  VirtualSize: string;
}
