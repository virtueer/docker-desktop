import { api } from "@/axios";
import { useQuery } from "@tanstack/react-query";
import { ApiRoutes } from "..";

async function containerList() {
  type ResponseType = ApiRoutes["container"]["list"];

  const response = await api.get<ResponseType>(`/v2/container/list`);
  return response.data;
}

export const useContainerList = () => {
  return useQuery({ queryKey: ["containerList"], queryFn: containerList });
};
