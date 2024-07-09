import { Row } from "@tanstack/react-table";
import { Compose, ContainerInfo } from "~types/v2/container/list";
import ComposeDeleteDialog from "@/components/v2/compose/delete-dialog";
import ComposePlayStop from "@/components/v2/compose/play-stop";
import ComposeThreeDots from "@/components/v2/compose/three-dots";
import ContainerDeleteDialog from "@/components/v2/container/delete-dialog";
import ContainerPlayStop from "@/components/v2/container/play-stop";
import ContainerThreeDots from "@/components/v2/container/three-dots";

export function Actions({ row }: { row: Row<any> }) {
  const isCompose = !!(row.original as any).name;
  const container = row.original as ContainerInfo;
  const compose = row.original as Compose;

  return (
    <div className="flex gap-0.5">
      {isCompose && <ComposePlayStop compose={compose} />}
      {isCompose && <ComposeThreeDots compose={compose} />}
      {isCompose && <ComposeDeleteDialog compose={compose} />}
      {!isCompose && <ContainerPlayStop container={container} />}
      {!isCompose && <ContainerThreeDots container={container} />}
      {!isCompose && <ContainerDeleteDialog container={container} />}
    </div>
  );
}
