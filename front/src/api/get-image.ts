import { useQuery } from "@tanstack/react-query";
import { GetImageResponse } from "~types/image";
import { api } from "../axios";

async function getImage(id: string) {
  const response = await api.get<GetImageResponse>(`/image/${id}`);
  return response.data;
}

export const useGetImage = (id: string) => {
  return useQuery({
    queryKey: [id],
    queryFn: () => getImage(id),
    retry(_, error) {
      return !error;
    },
  });
};
