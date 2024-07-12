import { Row } from "@tanstack/react-table";
import { Compose, ContainerInfo } from "~types/v2/container/list";
import ComposeDeleteDialog from "@/components/compose/delete-dialog";
import ComposePlayStop from "@/components/compose/play-stop";
import ComposeThreeDots from "@/components/compose/three-dots";
import ContainerDeleteDialog from "@/components/container/delete-dialog";
import ContainerPlayStop from "@/components/container/play-stop";
import ContainerThreeDots from "@/components/container/three-dots";

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
