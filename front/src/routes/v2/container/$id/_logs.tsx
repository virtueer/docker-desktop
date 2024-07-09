import { socket } from "@/socket";
import { Terminal } from "@xterm/xterm";
import { useEffect, useMemo, useRef, useState } from "react";

export default function LogsTab({ id }: { id: string }) {
  const [connect, setConnect] = useState(false);
  const xterm_container = useRef(null);
  const term = useMemo(
    () =>
      new Terminal({
        fontSize: 12,
      }),
    []
  );

  async function InitializeXterm() {
    const { FitAddon } = await import("@xterm/addon-fit");
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(xterm_container.current!);
    fitAddon.fit();

    setConnect(true);
  }

  function onLog({ log }: { log: string }) {
    const line = log.slice(0, -1); // slice last \n char
    term.writeln(line);
  }

  useEffect(() => {
    if (!connect) {
      return;
    }

    socket.on(`container logs ${id}`, onLog);
    socket.emit(`container logs`, { id });

    return () => {
      socket.off(`container logs ${id}`, onLog);
      socket.emit(`stop container logs ${id}`);
    };
  }, [connect]);

  useEffect(() => {
    if (!xterm_container.current) {
      return;
    }

    InitializeXterm();
  }, [xterm_container]);

  return <div ref={xterm_container} className="h-full" />;
}
