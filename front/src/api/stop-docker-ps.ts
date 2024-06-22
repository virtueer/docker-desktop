import { QueryClient, useMutation } from "@tanstack/react-query";
import { StatusResponse } from "~types/ps";
import { api } from "../axios";
import { useQueryClient } from "@tanstack/react-query";
import { getContainerById, updateContainerById } from "@/util";
import { LOADING_STATE } from "@/constants";
import { getDockerPsWrapper } from "./get-docker-ps";

async function stopDockerPs(id: string) {
  const response = await api.post<StatusResponse>(`/ps/stop?id=${id}`);
  return response.data;
}

async function stopDockerPsWrapper(queryClient: QueryClient, id: string) {
  const container = getContainerById(queryClient, id);

  if (container) {
    updateContainerById(queryClient, id, {
      State: container.State + LOADING_STATE,
    });
  }

  return stopDockerPs(id);
}

export const useStopDockerPs = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => stopDockerPsWrapper(queryClient, id),
    onSuccess() {
      getDockerPsWrapper(queryClient, id, true);
    },
  });
};
