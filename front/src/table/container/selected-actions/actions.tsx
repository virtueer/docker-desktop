import { usePauseDockerPs } from "@/api/pause-docker-ps";
import { useStartDockerPs } from "@/api/start-docker-ps";
import { useStopDockerPs } from "@/api/stop-docker-ps";
import { useUnpauseDockerPs } from "@/api/unpause-docker-ps";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";
import { DockerPs } from "~types/ps";
import { TableMetadata } from "../data-table";

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

  const { mutateAsync: stopContainerMutate } = useStopDockerPs();
  const { mutateAsync: startContainerMutate } = useStartDockerPs();
  const { mutateAsync: unPauseContainerMutate } = useUnpauseDockerPs();
  const { mutateAsync: pauseContainerMutate } = usePauseDockerPs();
  const { rowsMetadata } = table.options.meta as TableMetadata;

  async function handleStart() {
    for (const containerFlatRow of rows) {
      const container = containerFlatRow.original as DockerPs;
      const running = container.State === "running";

      if (running) {
        continue;
      }

      const paused = container.State === "paused";
      const stopped = container.State === "exited";

      rowsMetadata.setRowMetadataLoading(containerFlatRow.id);
      if (paused) {
        unPauseContainerMutate(container.ID).then(() =>
          rowsMetadata.unSetRowMetadataLoading(containerFlatRow.id)
        );
      }
      if (stopped) {
        startContainerMutate(container.ID).then(() =>
          rowsMetadata.unSetRowMetadataLoading(containerFlatRow.id)
        );
      }
    }
  }

  async function handleStop() {
    for (const containerFlatRow of rows) {
      const container = containerFlatRow.original as DockerPs;
      const stopped = container.State === "exited";

      if (stopped) {
        continue;
      }

      rowsMetadata.setRowMetadataLoading(containerFlatRow.id);
      stopContainerMutate(container.ID).then(() =>
        rowsMetadata.unSetRowMetadataLoading(containerFlatRow.id)
      );
    }
  }

  async function handlePause() {
    for (const containerFlatRow of rows) {
      const container = containerFlatRow.original as DockerPs;
      const running = container.State === "running";

      if (!running) {
        continue;
      }

      rowsMetadata.setRowMetadataLoading(containerFlatRow.id);
      pauseContainerMutate(container.ID).then(() =>
        rowsMetadata.unSetRowMetadataLoading(containerFlatRow.id)
      );
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
