import { api } from "@/axios";
import { useQuery } from "@tanstack/react-query";
import { ApiRoutes } from "./routes";

async function getVolumes() {
  type ResponseType = ApiRoutes["volume"]["list"];

  const response = await api.get<ResponseType>(`/volume/`);
  return response.data;
}

export const useGetVolumes = () => {
  return useQuery({ queryKey: ["volumes"], queryFn: getVolumes });
};
