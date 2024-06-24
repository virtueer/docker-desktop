import { useQuery } from "@tanstack/react-query";
import { GetImageByNameResponse } from "~types/image";
import { api } from "../axios";

export async function getImageByName(name: string) {
  const response = await api.get<GetImageByNameResponse>(`/image/name/${name}`);
  return response.data;
}

export const useGetImageByName = (name: string) => {
  return useQuery({
    queryKey: [name],
    queryFn: () => getImageByName(name),
    retry(_, error) {
      return !error;
    },
  });
};
