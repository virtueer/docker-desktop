// import { socket } from "@/socket";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useMemo, useRef } from "react";

export default function ExecTerminal({ id }: { id: string }) {
  const xterm_container = useRef(null);
  const term = useMemo(() => new Terminal(), []);

  useEffect(() => {
    if (xterm_container.current) {
      InitializeXterm();

      term.onData((data) => {
        // socket.emit("input", data);
      });
    }
  }, [xterm_container]);

  useEffect(() => {
    function onExec({ id: containerId, data }: { id: string; data: string }) {
      if (id === containerId) {
        term.write(data);
      }
    }

    // socket.on("exec", onExec);

    // return () => {
    //   socket.off("exec", onExec);
    // };
  }, []);

  async function InitializeXterm() {
    const { FitAddon } = await import("@xterm/addon-fit");
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(xterm_container.current!);
    fitAddon.fit();
    // socket.emit("exec", { id, cols: term.cols, rows: term.rows });
  }

  return <div id="xterm-container" ref={xterm_container} className="h-full" />;
}
