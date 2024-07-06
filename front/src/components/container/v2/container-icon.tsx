import { Container } from "~types/v2/container/list";
import { Link } from "@tanstack/react-router";
import { GoContainer } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { MdContentCopy } from "react-icons/md";
import { getColorByState } from "@/table/container/helper";

export function ContainerIcon({
  container,
  depth,
}: {
  container: Container;
  depth: number;
}) {
  const color = getColorByState(container.State);
  const paddingLeft = `${depth}rem`;

  return (
    <Link to={"/containers/$id"} params={{ id: container.Id }}>
      <div className="flex items-center gap-3">
        <div style={{ paddingLeft }}>
          {<GoContainer size="1.5rem" color={color} />}
        </div>
        <div className="flex flex-col gap-1">
          <span className="underline underline-offset-4">
            {container.Names}
          </span>
          <span
            className="flex gap-1 items-center text-white text-xs w-fit"
            onClick={() => navigator.clipboard.writeText(container.Id)}
          >
            {container.Id.slice(0, 12)}
            <Button
              variant="ghost"
              className="p-0 hover:bg-transparent focus:text-red-200 h-fit"
            >
              <MdContentCopy />
            </Button>
          </span>
        </div>
      </div>
    </Link>
  );
}