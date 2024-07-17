import { api } from "@/axios";
import { useQuery } from "@tanstack/react-query";
import { ApiRoutes } from "../routes";

async function inspectContainer(id: string) {
  type ResponseType = ApiRoutes["container"]["inspect"];

  const response = await api.get<ResponseType>(`/container/${id}`);
  return response.data;
}

export const useInspectContainer = (id: string) => {
  return useQuery({
    queryKey: ["inspect", id],
    queryFn: () => inspectContainer(id),
  });
};
