import { useGetComposeLogs } from "@/api/get-compose-logs";
import { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import "./terminal-scroll.css";
import { useEffect, useMemo, useRef } from "react";

export default function ComposeTerminal({ name }: { name: string }) {
  const xterm_container = useRef(null);
  const term = useMemo(() => new XTerm({ fontSize: 13 }), []);

  const { data, mutateAsync } = useGetComposeLogs(name);

  if (data?.status && data.data) {
    const lines = data.data.split(/\r?\n/);
    for (const line of lines) {
      term.writeln(line);
    }
  }

  useEffect(() => {
    if (xterm_container.current) {
      InitializeXterm();
    }
  }, [xterm_container]);

  async function InitializeXterm() {
    const { FitAddon } = await import("@xterm/addon-fit");
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(xterm_container.current!);
    fitAddon.fit();
    console.log(term.options);
    await mutateAsync({ cols: term.cols, rows: term.rows });
  }
  return <div id="xterm-container" ref={xterm_container} className="h-full" />;
}
