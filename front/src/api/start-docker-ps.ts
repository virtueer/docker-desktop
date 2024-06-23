import { useMutation } from "@tanstack/react-query";
import { StatusResponse } from "~types/ps";
import { api } from "../axios";

async function startDockerPs(id: string) {
  const response = await api.post<StatusResponse>(`/ps/${id}`);
  return response.data;
}

export const useStartDockerPs = (id: string) => {
  return useMutation({
    mutationFn: () => startDockerPs(id),
  });
};
