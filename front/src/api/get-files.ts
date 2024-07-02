import { useMutation } from "@tanstack/react-query";
import { GetFilesResponse } from "~types/file";
import { api } from "../axios";

async function getFiles(id: string, path = "/") {
  const response = await api.get<GetFilesResponse>(
    `/container/${id}/files?path=${path}`
  );
  return response.data;
}

export const useGetFiles = (id: string) => {
  return useMutation({
    mutationFn: (path?: string) => getFiles(id, path),
  });
};
