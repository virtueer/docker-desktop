import { useStore } from "@/store";
import { createFileRoute } from "@tanstack/react-router";
import { Compose } from "~types/container/";
import Container from "./_container";
import ComposeLogsTerminal from "./_terminal";

import { useStartContainer } from "@/api/container/start";
import { useStopContainer } from "@/api/container/stop";
import { useUnpauseContainer } from "@/api/container/unpause";
import RemoveComposeDialog from "@/components/compose/remove-compose-dialog";
import { TooltipButton } from "@/components/TooltipButton";
import { Button } from "@/components/ui/button";
import { getComposeColor } from "@/components/table/helper";
import { Link } from "@tanstack/react-router";
import { FaChevronLeft, FaPlay, FaStop } from "react-icons/fa6";
import { ImStack } from "react-icons/im";

export const Route = createFileRoute("/compose/$name")({
  component: Page,
});

function Page() {
  const { name } = Route.useParams();

  const compose = useStore((x) =>
    x.containers.find((x) => (x as Compose).name === name)
  ) as Compose;

  const { mutateAsync: unpause } = useUnpauseContainer();
  const { mutateAsync: start } = useStartContainer();
  const { mutateAsync: stop } = useStopContainer();

  if (!compose) return "no compose";

  const allRunning = compose.containers.every(
    (x) => x.State === "running" && !x.loading
  );

  const allExited = compose.containers.every(
    (x) => x.State === "exited" && !x.loading
  );

  const color = getComposeColor(compose);

  function handlePlay() {
    for (const container of compose.containers) {
      if (container.State === "running") continue;

      if (container.State === "paused") {
        unpause(container.Id);
      } else {
        start(container.Id);
      }
    }
  }

  function handleStop() {
    for (const container of compose.containers) {
      if (container.State === "exited") continue;
      stop(container.Id);
    }
  }

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
            className="bg-transparent border-2 border-blue-500 hover:text-blue-500 cursor-not-allowed"
          >
            View Configurations
          </Button>

          <div className="flex">
            <TooltipButton
              className="w-[50px] bg-blue-600 text-white hover:bg-blue-500 hover:text-white rounded-none rounded-l-md"
              tooltipText="Start"
              disabled={allRunning}
              onClick={handlePlay}
            >
              <FaPlay />
            </TooltipButton>
            <TooltipButton
              className="w-[50px] bg-blue-600 text-white hover:bg-blue-500 hover:text-white rounded-none rounded-r-md border-l-2"
              tooltipText="Stop"
              disabled={allExited}
              onClick={handleStop}
            >
              <FaStop size="1.1rem" />
            </TooltipButton>
          </div>

          <RemoveComposeDialog compose={compose} />
        </div>
      </div>

      <div className="flex gap-3 w-full h-full overflow-hidden">
        <div className="flex flex-col min-w-[335px] w-[335px] overflow-hidden overflow-y-auto scrollbar scrollbar-thin">
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
