import { api } from "@/axios";
import { useMutation } from "@tanstack/react-query";
import { ApiRoutes } from "../routes";

async function unpauseContainer(id: string) {
  type ResponseType = ApiRoutes["container"]["unpause"];

  const response = await api.post<ResponseType>(`/v2/container/${id}/unpause`);
  return response.data;
}

export const useUnpauseContainer = () => {
  return useMutation({
    mutationFn: (id: string) => unpauseContainer(id),
  });
};
