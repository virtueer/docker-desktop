import { useQuery } from "@tanstack/react-query";
import { GetDockerAllPsResponse } from "~types/ps";
import { api } from "../axios";

async function getCompose(name: string) {
  const response = await api.get<GetDockerAllPsResponse>(`/compose/${name}`);
  return response.data;
}

export const useGetCompose = (name: string) => {
  return useQuery({
    queryKey: ["compose"],
    queryFn: () => getCompose(name),
    retry(_, error) {
      return !error;
    },
  });
};
