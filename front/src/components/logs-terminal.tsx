import { socket } from "@/socket";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useMemo, useRef } from "react";

export default function LogsTerminal({ id }: { id: string }) {
  const xterm_container = useRef(null);
  const term = useMemo(() => new Terminal(), []);

  useEffect(() => {
    if (xterm_container.current) {
      InitializeXterm();
    }
  }, [xterm_container]);

  useEffect(() => {
    function onLogs({ id: containerId, data }: { id: string; data: string }) {
      if (id === containerId) {
        term.writeln(data);
      }
    }

    socket.on("logs", onLogs);
    socket.emit("logs", id);

    return () => {
      socket.off("events", onLogs);
    };
  }, []);

  async function InitializeXterm() {
    const { FitAddon } = await import("@xterm/addon-fit");
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(xterm_container.current!);
    fitAddon.fit();
  }

  return <div id="xterm-container" ref={xterm_container} className="h-full" />;
}
