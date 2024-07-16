import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";
import { DockerPs } from "~types/ps";

export default function Actions({ table }: { table: Table<any> }) {
  const flatRows = table.getSelectedRowModel().flatRows;
  if (flatRows.length === 0) return;

  const rows = flatRows.filter((x) => x.original.name === undefined);

  const startDisabled =
    rows.filter((x) => (x.original as DockerPs).State !== "running").length ===
    0;

  const pauseDisabled =
    rows.filter(
      (x) =>
        (x.original as DockerPs).State !== "paused" &&
        (x.original as DockerPs).State !== "exited"
    ).length === 0;

  const stopDisabled =
    rows.filter((x) => (x.original as DockerPs).State !== "exited").length ===
    0;

  async function handleStart() {}

  async function handleStop() {
    for (const containerFlatRow of rows) {
      const container = containerFlatRow.original as DockerPs;
      const stopped = container.State === "exited";

      if (stopped) {
        continue;
      }
    }
  }

  async function handlePause() {
    for (const containerFlatRow of rows) {
      const container = containerFlatRow.original as DockerPs;
      const running = container.State === "running";

      if (!running) {
        continue;
      }
    }
  }

  return (
    <div className="bg-blue-600 rounded text-white">
      <Button
        className="bg-inherit text-inherit hover:bg-blue-400 rounded-r-none"
        disabled={startDisabled}
        onClick={handleStart}
      >
        <FaPlay />
      </Button>
      <Button
        className="bg-inherit text-inherit hover:bg-blue-400 rounded-none border-x"
        disabled={pauseDisabled}
        onClick={handlePause}
      >
        <FaPause />
      </Button>
      <Button
        className="bg-inherit text-inherit hover:bg-blue-400 rounded-l-none"
        disabled={stopDisabled}
        onClick={handleStop}
      >
        <FaStop />
      </Button>
    </div>
  );
}
