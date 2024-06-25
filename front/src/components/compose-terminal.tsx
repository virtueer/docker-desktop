import { useGetComposeLogs } from "@/api/get-compose-logs";
import { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useMemo, useRef } from "react";

export default function ComposeTerminal({ name }: { name: string }) {
  const xterm_container = useRef(null);
  const term = useMemo(() => new XTerm(), []);

  const { data, mutateAsync } = useGetComposeLogs(name);

  console.log("data", data);

  if (data?.status && data.data) {
    console.log("writed");
    // term.write(data.data.slice(0, 110));
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
    term.onResize(console.log);

    console.log("InitializeXterm");
    const { FitAddon } = await import("@xterm/addon-fit");
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(xterm_container.current!);
    fitAddon.fit();
    await mutateAsync({ cols: term.cols, rows: term.rows });
    console.log("term", term);
    console.log("fitAddon", fitAddon);
  }
  return (
    <div id="xterm-container" ref={xterm_container} className="h-screen" />
  );
}
