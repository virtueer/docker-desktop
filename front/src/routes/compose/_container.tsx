import { Separator } from "@/components/ui/separator";
import ContainerDeleteDialog from "@/components/container/delete-dialog";
import ContainerPlayStop from "@/components/container/play-stop";
import ContainerThreeDots from "@/components/container/three-dots";
import {
  getColorByState,
  getContainerName,
  getImageId,
} from "@/table/container/helper";
import { Link } from "@tanstack/react-router";
import { GoContainer } from "react-icons/go";
import { ContainerInfo } from "~types/v2/container/list";

export default function Container({ container }: { container: ContainerInfo }) {
  const color = getColorByState(container.State);
  return (
    <>
      <div className="flex items-center">
        <GoContainer size="1.5rem" className="min-w-[1.5rem]" color={color} />
        <div className="flex flex-col mx-5 overflow-hidden">
          <span className="whitespace-nowrap font-bold text-ellipsis overflow-hidden">
            {getContainerName(container.Names)}
          </span>
          <Link
            to="/images/$id"
            params={{ id: getImageId(container.ImageID) }}
            className="underline underline-offset-2 text-blue-500 whitespace-nowrap overflow-hidden"
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
    </>
  );
}
