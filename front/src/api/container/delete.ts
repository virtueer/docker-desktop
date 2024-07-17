import { api } from "@/axios";
import { useMutation } from "@tanstack/react-query";
import { ApiRoutes } from "../routes";

async function deleteContainer(id: string) {
  type ResponseType = ApiRoutes["container"]["delete"];

  const response = await api.post<ResponseType>(`/v2/container/${id}/delete`);
  return response.data;
}

export const useDeleteContainer = () => {
  return useMutation({
    mutationFn: (id: string) => deleteContainer(id),
  });
};
