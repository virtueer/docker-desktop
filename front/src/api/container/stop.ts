import { api } from "@/axios";
import { useMutation } from "@tanstack/react-query";
import { ApiRoutes } from "../routes";

async function stopContainer(id: string) {
  type ResponseType = ApiRoutes["container"]["stop"];

  const response = await api.post<ResponseType>(`/v2/container/${id}/stop`);
  return response.data;
}

export const useStopContainer = () => {
  return useMutation({
    mutationFn: (id: string) => stopContainer(id),
  });
};
