import { useQuery } from "@tanstack/react-query";
import { GetContanerInspectResponse } from "~types/inspect";
import { api } from "../axios";

async function getContainerInspect(id: string) {
  const response = await api.get<GetContanerInspectResponse>(
    `/container/${id}/inspect`
  );
  return response.data;
}

export const useGetContainerInspect = (id: string) => {
  return useQuery({
    queryKey: ["inspect", id],
    queryFn: () => getContainerInspect(id),
    retry(_, error) {
      return !error;
    },
  });
};
