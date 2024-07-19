import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";
import { ApiRoutes } from "./routes";

export async function getUsage() {
  type ResponseType = ApiRoutes["usage"];

  const response = await api.get<ResponseType>(`/usage`);
  return response.data;
}

export const useGetUsage = (interval: number = 10000) => {
  return useQuery({
    queryKey: ["usage"],
    queryFn: getUsage,
    refetchInterval: interval,
  });
};
