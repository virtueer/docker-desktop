import { Button } from "@/components/ui/button";
import { FaPlay, FaStop } from "react-icons/fa";
import { DockerPs } from "~types/ps";

import { useStartDockerPs } from "@/api/start-docker-ps";
import { useStopDockerPs } from "@/api/stop-docker-ps";
import { TableMetadata } from "@/table/data-table";
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
  const { mutate: stopContainerMutate } = useStopDockerPs(dockerPs!.ID);
  const { mutate: startContainerMutate } = useStartDockerPs(dockerPs!.ID);

  const { rowsMetadata } = table.options.meta as TableMetadata;

  const options = {
    onSuccess() {
      rowsMetadata.unSetRowMetadataLoading(row.id);
    },
  };

  function handleStop() {
    if (!isCompose) {
      stopContainerMutate(undefined, options);
    }
  }

  function handlePlay() {
    if (!isCompose) {
      startContainerMutate(undefined, options);
    }
  }

  function handleClick() {
    rowsMetadata.setRowMetadataLoading(row.id);
    running ? handleStop() : handlePlay();
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
