import { useMutation } from "@tanstack/react-query";
import { StatusResponse } from "~types/ps";
import { api } from "../axios";

async function unPauseDockerPs(id: string) {
  const response = await api.put<StatusResponse>(`/ps/${id}/unpause`);
  return response.data;
}

export const useUnpauseDockerPs = () => {
  return useMutation({
    mutationFn: (id: string) => unPauseDockerPs(id),
  });
};
