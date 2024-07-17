import { api } from "@/axios";
import { useMutation } from "@tanstack/react-query";
import { ApiRoutes } from "../routes";

async function startContainer(id: string) {
  type ResponseType = ApiRoutes["container"]["start"];

  const response = await api.post<ResponseType>(`/v2/container/${id}/start`);
  return response.data;
}

export const useStartContainer = () => {
  return useMutation({
    mutationFn: (id: string) => startContainer(id),
  });
};
