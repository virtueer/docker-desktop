import { api } from "@/axios";
import { useMutation } from "@tanstack/react-query";
import { ApiRoutes } from "..";

async function pauseContainer(id: string) {
  type ResponseType = ApiRoutes["container"]["pause"];

  const response = await api.post<ResponseType>(`/v2/container/${id}/pause`);
  return response.data;
}

export const usePauseContainer = () => {
  return useMutation({
    mutationFn: (id: string) => pauseContainer(id),
  });
};
