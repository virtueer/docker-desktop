import { Separator } from "@/components/ui/separator";
import ContainerDeleteDialog from "@/components/v2/container/delete-dialog";
import ContainerPlayStop from "@/components/v2/container/play-stop";
import ContainerThreeDots from "@/components/v2/container/three-dots";
import { getColorByState, getContainerName } from "@/table/container/helper";
import { Link } from "@tanstack/react-router";
import { GoContainer } from "react-icons/go";
import { ContainerInfo } from "~types/v2/container/list";

export default function Container({ container }: { container: ContainerInfo }) {
  const color = getColorByState(container.State);
  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center">
        <GoContainer size="1.5rem" color={color} />
        <div className="flex flex-col mx-5">
          <span className="whitespace-nowrap font-bold">
            {getContainerName(container.Names)}
          </span>
          <Link
            to="/images/$id"
            params={{ id: container.Image }}
            className="underline underline-offset-2 text-blue-500"
          >
            {container.Image}
          </Link>
          <span className="capitalize">{container.State}</span>
        </div>
        <ContainerPlayStop container={container} />
        <ContainerThreeDots container={container} />
        <ContainerDeleteDialog container={container} />
      </div>
      <Separator className="my-2 bg-night-300" />
    </div>
  );
}
