// import { socket } from "@/socket";
import { socket } from "@/socket";
import { Terminal } from "@xterm/xterm";
import { useEffect, useMemo, useRef } from "react";

export default function ComposeLogsTerminal({ name }: { name: string }) {
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
    function onLog({ log }: { log: string }) {
      const line = log.slice(0, -1); // slice last \n char
      term.writeln(line); //
    }

    socket.on(`compose logs ${name}`, onLog);

    return () => {
      socket.off(`compose logs ${name}`, onLog);
    };
  }, []);

  async function InitializeXterm() {
    const { FitAddon } = await import("@xterm/addon-fit");
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(xterm_container.current!);
    fitAddon.fit();
    socket.emit(`compose logs`, { name });
  }

  return <div id="xterm-container" ref={xterm_container} className="h-full" />;
}
