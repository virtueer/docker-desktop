import { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useMemo, useRef } from "react";

export default function Terminal({ text }: { text: string }) {
  const xterm_container = useRef(null);
  const term = useMemo(() => new XTerm(), []);

  useEffect(() => {
    console.log(term);
    if (xterm_container.current) {
      InitializeXterm();
    }
  }, [xterm_container]);

  async function InitializeXterm() {
    console.log("InitializeXterm");
    const { FitAddon } = await import("@xterm/addon-fit");
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(xterm_container.current!);
    term.writeln(text);
    fitAddon.fit();
  }
  return (
    <div id="xterm-container" ref={xterm_container} className="h-screen" />
  );
}
