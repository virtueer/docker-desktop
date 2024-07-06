import { socket } from "@/socket";
import { create } from "zustand";
import { GrouppedContainer } from "~types/v2/container/list";

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
