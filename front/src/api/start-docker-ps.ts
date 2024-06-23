import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StatusResponse } from "~types/ps";
import { api } from "../axios";
import { getDockerPsWrapper } from "./get-docker-ps";

async function startDockerPs(id: string) {
  const response = await api.post<StatusResponse>(`/ps/${id}`);
  return response.data;
}

export const useStartDockerPs = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => startDockerPs(id),
    onSuccess() {
      getDockerPsWrapper(queryClient, id, true);
    },
  });
};
