import { useQuery } from "@tanstack/react-query";
import { GetContanerLogsResponse } from "~types/container";
import { api } from "../axios";

async function getContainerLogs(id: string) {
  const response = await api.get<GetContanerLogsResponse>(
    `/container/${id}/logs`
  );
  return response.data;
}

export const useGetContainerLogs = (id: string) => {
  return useQuery({
    queryKey: ["logs", id],
    queryFn: () => getContainerLogs(id),
    retry(_, error) {
      return !error;
    },
  });
};
