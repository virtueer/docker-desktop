import { getDockerPsWrapper } from "@/api/get-docker-ps";
// import { socket } from "@/socket";
import { deleteContainerById } from "@/util";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { DestroyContainerAction, Events } from "~types/events";

export default function PsWatcher() {
  const queryClient = useQueryClient();

  function handleContainerDeleted(data: DestroyContainerAction) {
    deleteContainerById(queryClient, data.id);
  }

  useEffect(() => {
    function onEvents(data: Events) {
      console.log("onEvents", data);

      switch (data.Action) {
        case "start":
          getDockerPsWrapper(queryClient, data.id, true);
          break;

        case "stop":
          getDockerPsWrapper(queryClient, data.id, true);
          break;

        case "pause":
          getDockerPsWrapper(queryClient, data.id, true);
          break;

        case "unpause":
          getDockerPsWrapper(queryClient, data.id, true);
          break;

        case "create":
          getDockerPsWrapper(queryClient, data.id, false, true);
          break;

        case "destroy":
          handleContainerDeleted(data);
          break;

        default:
          break;
      }
    }

    // socket.on("events", onEvents);

    // return () => {
    //   socket.off("events", onEvents);
    // };
  }, []);

  return <></>;
}
