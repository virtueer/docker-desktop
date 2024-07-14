import { useStore } from "@/store";
import { createFileRoute } from "@tanstack/react-router";
import { Compose } from "~types/v2/container/list";
import Container from "./_container";
import ComposeLogsTerminal from "./_terminal";

import { Button } from "@/components/ui/button";
import { getComposeColor } from "@/table/container/helper";
import { Link } from "@tanstack/react-router";
import { FaChevronLeft, FaPlay, FaStop } from "react-icons/fa6";
import { ImStack } from "react-icons/im";
import RemoveComposeDialog from "@/components/compose/remove-compose-dialog";

export const Route = createFileRoute("/compose/$name")({
  component: Page,
});

function Page() {
  const { name } = Route.useParams();

  const compose = useStore((x) =>
    x.containers.find((x) => (x as Compose).name === name)
  ) as Compose;

  if (!compose) return "no compose";

  const color = getComposeColor(compose);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b mb-3">
        <div className="flex items-center gap-5">
          <Link to="/container">
            <Button
              variant="ghost"
              className="rounded-full p-3 text-night-200 hover:text-blue-500"
            >
              <FaChevronLeft />
            </Button>
          </Link>
          <ImStack size="1.5rem" color={color} />

          <div className="flex flex-col">
            <span className="font-semibold text-xl">{compose.name}</span>
            <span className="text-sm text-slate-500">path</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="bg-transparent border-2 border-blue-500 hover:text-blue-500"
          >
            View Configurations
          </Button>

          <div className="flex">
            <Button className="w-[50px] bg-blue-600 text-white hover:bg-blue-500 rounded-none rounded-l-md">
              <FaPlay />
            </Button>
            <Button
              className="w-[50px] bg-blue-600 text-white hover:bg-blue-500 rounded-none rounded-r-md border-l-2"
              disabled={!compose.containers.find((x) => x.State === "running")}
            >
              <FaStop size="1.1rem" />
            </Button>
          </div>

          <RemoveComposeDialog compose={compose} />
        </div>
      </div>

      <div className="flex gap-3 w-full h-full">
        <div className="flex flex-col w-[400px] overflow-hidden overflow-y-auto scrollbar scrollbar-thin">
          {compose.containers.map((container) => (
            <Container container={container} key={container.Id} />
          ))}
        </div>
        <div className="w-full border">
          <ComposeLogsTerminal name={name} />
        </div>
      </div>
    </div>
  );
}
