import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";
import { DockerPs } from "~types/ps";

export default function SelectedActions({ table }: { table: Table<any> }) {
  const flatRows = table.getSelectedRowModel().flatRows;
  if (flatRows.length === 0) return;

  const composeExcludedFlatRows = flatRows.filter(
    (x) => x.original.name === undefined
  );

  const startDisabled =
    composeExcludedFlatRows.filter(
      (x) => (x.original as DockerPs).State !== "running"
    ).length === 0;

  const pauseDisabled =
    composeExcludedFlatRows.filter(
      (x) => (x.original as DockerPs).State !== "paused"
    ).length === 0;

  const stopDisabled =
    composeExcludedFlatRows.filter(
      (x) => (x.original as DockerPs).State !== "exited"
    ).length === 0;

  return (
    <div className="flex gap-5 items-center">
      <Button variant="destructive" disabled>
        Delete
      </Button>

      <div className="bg-blue-600 rounded text-white">
        <Button
          className="bg-inherit text-inherit hover:bg-blue-400 rounded-r-none"
          disabled={startDisabled}
        >
          <FaPlay />
        </Button>
        <Button
          className="bg-inherit text-inherit hover:bg-blue-400 rounded-none border-x"
          disabled={pauseDisabled}
        >
          <FaPause />
        </Button>
        <Button
          className="bg-inherit text-inherit hover:bg-blue-400 rounded-l-none"
          disabled={stopDisabled}
        >
          <FaStop />
        </Button>
      </div>
    </div>
  );
}
