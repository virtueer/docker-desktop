import { useQuery } from "@tanstack/react-query";
import { GetVolumesResponse } from "~types/volume";
import { api } from "../axios";

async function getVolumes() {
  const response = await api.get<GetVolumesResponse>(`/volume`);
  return response.data;
}

export async function getVolumesWrapper() {
  const response = await getVolumes();

  if (!response.status) {
    throw response.error;
  }

  return response;
}

export const useGetvolumes = () => {
  return useQuery({
    queryKey: ["volumes"],
    queryFn: getVolumesWrapper,
    retry(_, error) {
      return !error;
    },
  });
};
