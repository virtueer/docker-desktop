import { FailResponse } from "./ps";

export type GetImagesResponse = GetImagesResponseSuccess | FailResponse;
export type GetImageResponse = GetImageResponseSuccess | FailResponse;
export type GetImageByNameResponse =
  | GetImageByNameResponseSuccess
  | FailResponse;

export interface GetImagesResponseSuccess {
  status: true;
  data: Image[];
}

export interface GetImageResponseSuccess {
  status: true;
  data: ImageLayer[];
}

export interface GetImageByNameResponseSuccess {
  status: true;
  data: Image;
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

export interface ImageLayer {
  Comment: string;
  CreatedAt: string;
  CreatedBy: string;
  CreatedSince: string;
  ID: string;
  Size: string;
}
