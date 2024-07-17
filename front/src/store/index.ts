import { socket } from "@/socket";
import { create } from "zustand";
import { Compose, ContainerInfo, GrouppedContainer } from "~types/container/";

type State = {
  containers: GrouppedContainer[];
};

type Actions = {
  setContainers: (containers: GrouppedContainer[]) => void;
};

socket.on("containers", onContainers);

function onContainers(data: any) {
  console.log("Containers handled");
  useStore.getState().setContainers(data);
}

export const useStore = create<State & Actions>((set) => ({
  containers: [],
  setContainers: (containers: any) => set({ containers }),
}));

export const getContainerById = (id: string) => {
  const containers = useStore((x) => x.containers);

  const container = containers.find(
    (x) => (x as ContainerInfo).Id === id
  ) as ContainerInfo;
  if (container) return container;

  const compose = containers.find((x) =>
    (x as Compose).containers?.find((y) => y.Id === id)
  ) as Compose;

  if (!compose) return undefined;

  return compose.containers.find((x) => x.Id === id);
};
