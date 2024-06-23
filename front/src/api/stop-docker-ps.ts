import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StatusResponse } from "~types/ps";
import { api } from "../axios";
import { getDockerPsWrapper } from "./get-docker-ps";

async function stopDockerPs(id: string) {
  const response = await api.delete<StatusResponse>(`/ps/${id}`);
  return response.data;
}

export const useStopDockerPs = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => stopDockerPs(id),
    onSuccess() {
      getDockerPsWrapper(queryClient, id, true);
    },
  });
};
