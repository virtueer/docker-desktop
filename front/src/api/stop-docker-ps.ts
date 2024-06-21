import { useMutation } from "@tanstack/react-query";
import { StatusResponse } from "~types/ps";
import { api } from "../axios";

async function stopDockerPs(id: string) {
  const response = await api.post<StatusResponse>(`/ps/stop?id=${id}`);
  return response.data;
}

export const useStopDockerPs = () =>
  useMutation({
    mutationFn: (id: string) => stopDockerPs(id),
  });
