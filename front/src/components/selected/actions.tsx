import { useStartContainer } from "@/api/container/start";
import { Button } from "@/components/ui/button";
import { RowSelectionState } from "@tanstack/react-table";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";
import { getContainersByIds } from "./helper";
import { useUnpauseContainer } from "@/api/container/unpause";
import { useStopContainer } from "@/api/container/stop";
import { usePauseContainer } from "@/api/container/pause";

export default function SelectedActions({
  rowSelection,
}: {
  rowSelection: RowSelectionState;
}) {
  const containers = getContainersByIds(Object.keys(rowSelection));

  const { mutateAsync: start } = useStartContainer();
  const { mutateAsync: unpause } = useUnpauseContainer();
  const { mutateAsync: pause } = usePauseContainer();
  const { mutateAsync: stop } = useStopContainer();

  const allRunning = containers.every(
    (x) => x.State === "running" && !x.loading
  );
  const allExited = containers.every((x) => x.State === "exited" && !x.loading);
  const allPaused = containers.every((x) => x.State === "paused" && !x.loading);

  async function handleStart() {
    for (const container of containers) {
      if (container.State === "running") {
        continue;
      }

      if (container.State === "paused") {
        unpause(container.Id);
      } else {
        start(container.Id);
      }
    }
  }

  async function handleStop() {
    for (const container of containers) {
      if (container.State === "exited") {
        continue;
      }

      stop(container.Id);
    }
  }

  async function handlePause() {
    for (const container of containers) {
      if (container.State === "paused" || container.State === "exited") {
        continue;
      }

      pause(container.Id);
    }
  }

  return (
    <div className="rounded text-white">
      <Button
        className="bg-inherit text-inherit bg-blue-600 hover:bg-blue-400 rounded-r-none disabled:bg-slate-700"
        disabled={allRunning}
        onClick={handleStart}
      >
        <FaPlay />
      </Button>
      <Button
        className="bg-inherit text-inherit bg-blue-600 hover:bg-blue-400 rounded-none border-x-2 border-x-blue-500 disabled:border-x-slate-500 disabled:bg-slate-700"
        disabled={allPaused || allExited}
        onClick={handlePause}
      >
        <FaPause />
      </Button>
      <Button
        className="bg-inherit text-inherit bg-blue-600 hover:bg-blue-400 rounded-l-none disabled:bg-slate-700"
        disabled={allExited}
        onClick={handleStop}
      >
        <FaStop />
      </Button>
    </div>
  );
}
