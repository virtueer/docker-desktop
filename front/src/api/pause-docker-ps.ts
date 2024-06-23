import { useMutation } from "@tanstack/react-query";
import { StatusResponse } from "~types/ps";
import { api } from "../axios";

async function pauseDockerPs(id: string) {
  const response = await api.put<StatusResponse>(`/ps/${id}/pause`);
  return response.data;
}

export const usePauseDockerPs = () => {
  return useMutation({
    mutationFn: (id: string) => pauseDockerPs(id),
  });
};
