import { Row } from "@tanstack/react-table";
import { Compose, ContainerInfo } from "~types/container";
import ComposeDeleteDialog from "@/components/compose/delete-dialog";
import ComposePlayStop from "@/components/compose/play-stop";
import ComposeThreeDots from "@/components/compose/three-dots";
import ContainerDeleteDialog from "@/components/container/delete-dialog";
import ContainerPlayStop from "@/components/container/play-stop";
import ContainerThreeDots from "@/components/container/three-dots";
import { Separator } from "@/components/ui/separator";

export function Actions({ row }: { row: Row<any> }) {
  const isCompose = !!(row.original as any).name;
  const container = row.original as ContainerInfo;
  const compose = row.original as Compose;

  return (
    <div className="flex gap-0.5 h-full pr-4">
      {isCompose && <ComposePlayStop compose={compose} />}
      {isCompose && <ComposeThreeDots compose={compose} />}
      {isCompose && (
        <Separator
          orientation="vertical"
          className="min-h-[2rem] mx-3 bg-slate-600 w-[0.5px]"
        />
      )}
      {isCompose && <ComposeDeleteDialog compose={compose} />}
      {!isCompose && <ContainerPlayStop container={container} />}
      {!isCompose && <ContainerThreeDots container={container} />}
      {!isCompose && (
        <Separator
          orientation="vertical"
          className="min-h-[2rem] mx-3 bg-slate-600 w-[0.5px]"
        />
      )}
      {!isCompose && <ContainerDeleteDialog container={container} />}
    </div>
  );
}
