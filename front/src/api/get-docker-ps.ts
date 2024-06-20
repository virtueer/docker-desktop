import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";
import { GetDockerPsResponse } from "~types/ps";

async function getDockerPs() {
  const response = await api.get<GetDockerPsResponse>("/ps");
  return response.data;

  // await new Promise(r => setTimeout(r, 1000))
  // return []
}

export const useGetDockerPs = () =>
  useQuery({
    queryKey: ["getDockerPs"],
    queryFn: getDockerPs,
  });
