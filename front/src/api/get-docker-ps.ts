import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { GetDockerPsResponse } from "~types/ps";
import { createContainer, updateContainerById } from "@/util";

async function getDockerPs(id: string) {
  const response = await api.get<GetDockerPsResponse>(`/ps/${id}`);
  return response.data;
}

export async function getDockerPsWrapper(
  queryClient: QueryClient,
  id: string,
  update = false,
  upsert = false
) {
  const response = await getDockerPs(id);

  if (!response.status) {
    throw response.error;
  }

  if (update) {
    updateContainerById(queryClient, id, response.data);
  }

  if (upsert) {
    createContainer(queryClient, response.data);
  }

  return response;
}

export const useGetDockerPs = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [id],
    queryFn: () => getDockerPsWrapper(queryClient, id),
    retry(_, error) {
      return !error;
    },
  });
};
