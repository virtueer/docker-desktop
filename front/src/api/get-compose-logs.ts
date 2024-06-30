import { useMutation } from "@tanstack/react-query";
import { GetContainerLogsResponse } from "~types/container";
import { api } from "../axios";

async function getComposeLogs(name: string, cols: number, rows: number) {
  const response = await api.get<GetContainerLogsResponse>(
    `/compose/${name}/logs?cols=${cols}&rows=${rows}`
  );
  return response.data;
}

/**
 * Enabled false by default
 */
export const useGetComposeLogs = (name: string) => {
  return useMutation({
    mutationFn: ({ cols, rows }: { cols: number; rows: number }) =>
      getComposeLogs(name, cols, rows),
  });
};
