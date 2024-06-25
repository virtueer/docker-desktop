import { FailResponse, StatusResponse } from "./base";

export type GetContanerLogsResponse =
  | GetContanerLogsResponseSuccess
  | FailResponse;

export interface GetContanerLogsResponseSuccess extends StatusResponse {
  status: true;
  data: string;
}
