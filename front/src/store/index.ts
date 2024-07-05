import { io } from "socket.io-client";
import { create } from "zustand";
import { GrouppedContainer } from "~types/v2/container/list";

type State = {
  containers: GrouppedContainer[];
};

type Actions = {
  setContainers: (containers: GrouppedContainer[]) => void;
};

export const useStore = create<State & Actions>((set) => ({
  containers: [],
  setContainers: (containers: any) => set({ containers }),
}));

const socket = io(import.meta.env.VITE_API_BASE_URL, {});

function onContainers(data: any) {
  console.log("Containers handled");
  useStore.getState().setContainers(data);
}

socket.on("containers", onContainers);
