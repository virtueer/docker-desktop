import { socket } from "@/socket";
import { useEffect } from "react";

export default function PsWatcher() {
  useEffect(() => {
    function onEvents(data: string) {
      console.log("onEvents", data);
    }

    socket.on("events", onEvents);

    return () => {
      socket.off("events", onEvents);
    };
  }, []);

  return <></>;
}
