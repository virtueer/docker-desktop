import { useMutation } from "@tanstack/react-query";
import { StatusResponse } from "~types/ps";
import { api } from "../axios";

async function stopDockerPs(id: string) {
  const response = await api.delete<StatusResponse>(`/ps/${id}`);
  return response.data;
}

export const useStopDockerPs = () => {
  return useMutation({
    mutationFn: (id: string) => stopDockerPs(id),
  });
};
