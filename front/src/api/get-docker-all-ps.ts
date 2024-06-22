import { useQuery } from "@tanstack/react-query";
import { GetDockerAllPsResponse } from "~types/ps";
import { api } from "../axios";

async function getDockerAllPs() {
  const response = await api.get<GetDockerAllPsResponse>(`/ps`);
  return response.data;
}

export async function getDockerAllPsWrapper() {
  const response = await getDockerAllPs();

  if (!response.status) {
    throw response.error;
  }

  return response;
}

export const useGetDockerAllPs = () => {
  return useQuery({
    queryKey: ["containers"],
    queryFn: getDockerAllPsWrapper,
    retry(_, error) {
      return !error;
    },
  });
};
