export interface StatusResponse {
  status: boolean;
}

export interface FailResponse extends StatusResponse {
  status: false;
  error: string;
}
