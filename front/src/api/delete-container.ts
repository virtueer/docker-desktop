import { useMutation } from "@tanstack/react-query";
import { StatusResponse } from "~types/ps";
import { api } from "../axios";

export async function deleteContainer(id: string) {
  const response = await api.delete<StatusResponse>(`/container/${id}`);
  return response.data;
}

export const useDeleteContainer = () => {
  return useMutation({
    mutationFn: (id: string) => deleteContainer(id),
  });
};
