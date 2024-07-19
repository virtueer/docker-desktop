import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";
import { ApiRoutes } from "./routes";

export async function getInfo() {
  type ResponseType = ApiRoutes["info"];

  const response = await api.get<ResponseType>(`/info`);
  return response.data;
}

export const useGetInfo = (interval: number = 10000) => {
  return useQuery({
    queryKey: ["info"],
    queryFn: getInfo,
    refetchInterval: interval,
  });
};
