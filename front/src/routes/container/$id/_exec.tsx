import { socket } from "@/socket";
import { getContainerById } from "@/store";
import { Terminal } from "@xterm/xterm";
import { useEffect, useMemo, useRef } from "react";
import { MdTerminal } from "react-icons/md";
import NotRunning from "./_components/not-running";

export default function ExecTab({ id }: { id: string }) {
  const container = getContainerById(id)!;

  if (container.State !== "running") {
    return (
      <NotRunning
        Icon={MdTerminal}
        text="To execute commands, run the container."
      />
    );
  }

  const xterm_container = useRef(null);
  const term = useMemo(
    () =>
      new Terminal({
        fontSize: 12,
      }),
    []
  );

  useEffect(() => {
    if (xterm_container.current) {
      InitializeXterm();
    }
  }, [xterm_container]);

  useEffect(() => {
    function onLogs({ data }: { data: string }) {
      term.write(data);
    }

    socket.on(`container exec logs ${id}`, onLogs);

    return () => {
      socket.off(`container exec logs ${id}`, onLogs);
      socket.emit(`container exec stop ${id}`);
    };
  }, []);

  async function InitializeXterm() {
    console.log("InitializeXterm");
    const { FitAddon } = await import("@xterm/addon-fit");
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(xterm_container.current!);
    fitAddon.fit();
    socket.emit("container exec", { id, cols: term.cols, rows: term.rows });

    term.onData((data) => {
      socket.emit(`container exec input ${id}`, data);
    });
  }

  return <div ref={xterm_container} className="h-full" />;
}
