import { useMutation } from "@tanstack/react-query";
import { GetContanerLogsResponse } from "~types/container";
import { api } from "../axios";

async function getContainerLogs(id: string, cols: number, rows: number) {
  const response = await api.get<GetContanerLogsResponse>(
    `/container/${id}/logs?cols=${cols}&rows=${rows}`
  );
  return response.data;
}

export const useGetContainerLogs = (id: string) => {
  return useMutation({
    mutationFn: ({ cols, rows }: { cols: number; rows: number }) =>
      getContainerLogs(id, cols, rows),
  });
};
