import { Button } from "@/components/ui/button";
import { FaPlay, FaStop } from "react-icons/fa";
import { Compose, DockerPs } from "~types/ps";

import { useStartDockerPs } from "@/api/start-docker-ps";
import { useStopDockerPs } from "@/api/stop-docker-ps";
import { TableMetadata } from "@/table/data-table";
import { Row, Table } from "@tanstack/react-table";
import { useUnpauseDockerPs } from "@/api/unpause-docker-ps";

export default function PlayStop({
  isCompose,
  dockerPs,
  row,
  table,
}: {
  isCompose: boolean;
  dockerPs?: DockerPs;
  row: Row<any>;
  table: Table<any>;
}) {
  const { mutateAsync: stopContainerMutate } = useStopDockerPs();
  const { mutateAsync: startContainerMutate } = useStartDockerPs();
  const { mutateAsync: unPauseContainerMutate } = useUnpauseDockerPs();

  const { rowsMetadata } = table.options.meta as TableMetadata;
  const state = (row.original as DockerPs).State;
  const running = state === "running";
  const allRunning = (row.original as Compose).containers?.find(
    (x) => x.State !== "running"
  );

  async function handleStop(containerId: string, rowId: string) {
    await stopContainerMutate(containerId);
    rowsMetadata.unSetRowMetadataLoading(rowId);
  }

  async function handlePlay(containerId: string, rowId: string, state: string) {
    if (state === "paused") unPauseContainerMutate(containerId);
    else startContainerMutate(containerId);
    rowsMetadata.unSetRowMetadataLoading(rowId);
  }

  function startContainer(state: string) {
    rowsMetadata.setRowMetadataLoading(row.id);
    handlePlay(dockerPs!.ID, row.id, state);
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

    const started = (row.original as DockerPs).State === "running";

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
      handlePlay(container.ID, row.id, row.original.State);
    }
  }

  function handleClick() {
    console.log(isCompose, running, allRunning);
    if (!isCompose && running) stopContainer();
    if (!isCompose && !running) startContainer(state);
    if (isCompose && allRunning) startCompose();
    if (isCompose && !allRunning) stopCompose();
  }

  return (
    <Button
      variant="ghost"
      className="p-2 rounded-full h-auto hover:bg-slate-300"
      onClick={handleClick}
      disabled={rowsMetadata.isRowLoading(row.id)}
    >
      {isCompose && allRunning && <FaPlay />}
      {isCompose && !allRunning && <FaStop />}
      {!isCompose && running && <FaStop />}
      {!isCompose && !running && <FaPlay />}
    </Button>
  );
}
