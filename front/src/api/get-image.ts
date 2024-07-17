import { api } from "@/axios";
import { useQuery } from "@tanstack/react-query";
import { ApiRoutes } from "./routes";

async function getImage(id: string) {
  type ResponseType = ApiRoutes["image"]["info"];

  const response = await api.get<ResponseType>(`/image/${id}`);
  return response.data;
}

export const useGetImage = (id: string) => {
  return useQuery({ queryKey: ["image", id], queryFn: () => getImage(id) });
};
