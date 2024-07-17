import { useStore } from "@/store";
import { Compose, ContainerInfo } from "~types/container/";

export const getContainersByIds = (ids: string[]) => {
  return useStore(
    (state) =>
      state.containers
        .filter(
          (container) =>
            ids.includes((container as ContainerInfo).Id) ||
            ids.includes((container as Compose).name)
        )
        .map((container) => {
          if ((container as Compose).name) {
            return (container as Compose).containers;
          }

          return container;
        })
        .flat() as ContainerInfo[]
  );
};
