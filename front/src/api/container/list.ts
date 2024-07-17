import { api } from "@/axios";
import { useQuery } from "@tanstack/react-query";
import { ApiRoutes } from "../routes";

async function containerList() {
  type ResponseType = ApiRoutes["container"]["list"];

  const response = await api.get<ResponseType>(`/container/`);
  return response.data;
}

export const useContainerList = () => {
  return useQuery({ queryKey: ["containerList"], queryFn: containerList });
};
