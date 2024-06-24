import { useQuery } from "@tanstack/react-query";
import { GetImagesResponse } from "~types/image";
import { api } from "../axios";

async function getImages() {
  const response = await api.get<GetImagesResponse>(`/image`);
  return response.data;
}

export async function getImagesWrapper() {
  const response = await getImages();

  if (!response.status) {
    throw response.error;
  }

  return response;
}

export const useGetImages = () => {
  return useQuery({
    queryKey: ["images"],
    queryFn: getImagesWrapper,
    retry(_, error) {
      return !error;
    },
  });
};
