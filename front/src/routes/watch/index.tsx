// import { socket } from "@/socket";
import { createFileRoute } from "@tanstack/react-router";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useMemo, useRef } from "react";

export const Route = createFileRoute("/watch/")({
  component: Page,
});

function Page() {
  const xterm_container = useRef(null);
  const term = useMemo(() => new Terminal(), []);

  useEffect(() => {
    if (xterm_container.current) {
      InitializeXterm();
    }
  }, [xterm_container]);

  useEffect(() => {
    function onEvents(data: string) {
      term.writeln(data);
    }

    // socket.on("events", onEvents);

    // return () => {
    //   socket.off("events", onEvents);
    // };
  }, []);

  async function InitializeXterm() {
    const { FitAddon } = await import("@xterm/addon-fit");
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(xterm_container.current!);
    fitAddon.fit();
  }

  return (
    <div id="xterm-container" ref={xterm_container} className="h-screen" />
  );
}
