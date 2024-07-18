import { getColorByState, getContainerName } from "@/components/table/helper";
import { Link } from "@tanstack/react-router";
import { GoContainer } from "react-icons/go";
import { ContainerInfo } from "~types/container";
import CopyableId from "../copyable-id";

export function ContainerIcon({
  container,
  depth,
}: {
  container: ContainerInfo;
  depth: number;
}) {
  const color = getColorByState(container.State);
  const paddingLeft = `${depth}rem`;

  return (
    <Link
      to="/container/$id"
      params={{ id: container.Id }}
      className="drag-none text-blue-500 font-bold"
    >
      <div className="flex items-center gap-3">
        <div style={{ paddingLeft }}>
          {<GoContainer size="1.5rem" color={color} />}
        </div>
        <div className="flex flex-col">
          <span className="underline underline-offset-2">
            {getContainerName(container.Names)}
          </span>
          <CopyableId id={container.Id} />
        </div>
      </div>
    </Link>
  );
}
