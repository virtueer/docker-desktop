import { api } from "@/axios";
import { useQuery } from "@tanstack/react-query";
import { ApiRoutes } from "../routes";

async function containerStats(id: string) {
  type ResponseType = ApiRoutes["container"]["stats"];

  const response = await api.get<ResponseType>(`/container/${id}/stats`);
  return response.data;
}

export const useContainerStats = (id: string) => {
  return useQuery({
    queryKey: ["stats", id],
    queryFn: () => containerStats(id),
  });
};
