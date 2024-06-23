import { Button } from "@/components/ui/button";
import { FaPlay, FaStop } from "react-icons/fa";
import { Compose, DockerPs } from "~types/ps";

import { useStartDockerPs } from "@/api/start-docker-ps";
import { useStopDockerPs } from "@/api/stop-docker-ps";
import { TableMetadata } from "@/table/data-table";
import { getStatus } from "@/table/helper";
import { Row, Table } from "@tanstack/react-table";

export default function PlayStop({
  isCompose,
  dockerPs,
  running,
  row,
  table,
}: {
  running: boolean;
  isCompose: boolean;
  dockerPs?: DockerPs;
  row: Row<any>;
  table: Table<any>;
}) {
  const { mutateAsync: stopContainerMutate } = useStopDockerPs();
  const { mutateAsync: startContainerMutate } = useStartDockerPs();

  const { rowsMetadata } = table.options.meta as TableMetadata;

  async function handleStop(containerId: string, rowId: string) {
    await stopContainerMutate(containerId);
    rowsMetadata.unSetRowMetadataLoading(rowId);
  }

  async function handlePlay(containerId: string, rowId: string) {
    startContainerMutate(containerId);
    rowsMetadata.unSetRowMetadataLoading(rowId);
  }

  function startContainer() {
    rowsMetadata.setRowMetadataLoading(row.id);
    handlePlay(dockerPs!.ID, row.id);
  }

  function stopContainer() {
    rowsMetadata.setRowMetadataLoading(row.id);
    handleStop(dockerPs!.ID, row.id);
  }

  function getRow(container: DockerPs) {
    const rows = table.getRowModel().flatRows;
    const row = rows.find(
      (row) => (row.original as DockerPs).ID === container.ID
    )!;

    const isLoading = rowsMetadata.isRowLoading(row.id);
    if (isLoading) {
      return {};
    }

    const status = getStatus(row.original);
    const started = status.startsWith("Up") || status.startsWith("Running");

    return { started, row };
  }

  function stopCompose() {
    for (const container of (row.original as Compose).containers) {
      const { started, row } = getRow(container);

      if (!row || !started) continue;

      rowsMetadata.setRowMetadataLoading(row.id);
      handleStop(container.ID, row.id);
    }
  }

  function startCompose() {
    for (const container of (row.original as Compose).containers) {
      const { started, row } = getRow(container);

      if (!row || started) continue;

      rowsMetadata.setRowMetadataLoading(row.id);
      handlePlay(container.ID, row.id);
    }
  }

  function handleClick() {
    if (!isCompose && running) stopContainer();
    if (!isCompose && !running) startContainer();
    if (isCompose && running) stopCompose();
    if (isCompose && !running) startCompose();
  }

  return (
    <Button
      variant="ghost"
      className="p-2 rounded-full h-auto hover:bg-slate-300"
      onClick={handleClick}
      disabled={rowsMetadata.isRowLoading(row.id)}
    >
      {running && <FaStop />}
      {!running && <FaPlay />}
    </Button>
  );
}
