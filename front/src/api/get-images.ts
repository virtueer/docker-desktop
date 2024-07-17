import { api } from "@/axios";
import { useQuery } from "@tanstack/react-query";
import { ApiRoutes } from "./routes";

async function getImages() {
  type ResponseType = ApiRoutes["image"]["list"];

  const response = await api.get<ResponseType>(`/image/`);
  return response.data;
}

export const useGetImages = () => {
  return useQuery({ queryKey: ["images"], queryFn: getImages });
};
