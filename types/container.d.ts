import { FailResponse, StatusResponse } from "./base";

export type GetContainerLogsResponse =
  | GetContainerLogsResponseSuccess
  | FailResponse;

export interface GetContainerLogsResponseSuccess extends StatusResponse {
  status: true;
  data: string;
}
