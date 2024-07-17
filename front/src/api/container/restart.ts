import { api } from "@/axios";
import { useMutation } from "@tanstack/react-query";
import { ApiRoutes } from "../routes";

async function restartContainer(id: string) {
  type ResponseType = ApiRoutes["container"]["restart"];

  const response = await api.post<ResponseType>(`/v2/container/${id}/restart`);
  return response.data;
}

export const useRestartContainer = () => {
  return useMutation({
    mutationFn: (id: string) => restartContainer(id),
  });
};
