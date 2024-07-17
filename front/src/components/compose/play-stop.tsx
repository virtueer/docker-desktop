import { IoMdPlay } from "react-icons/io";
import { IoStopSharp } from "react-icons/io5";

import { Compose } from "~types/v2/container/list";
import { TooltipButton } from "../TooltipButton";
import { useStopContainer } from "@/api/container/stop";
import { useStartContainer } from "@/api/container/start";
import { useUnpauseContainer } from "@/api/container/unpause";

type Props = {
  compose: Compose;
};

export default function ComposePlayStop({ compose }: Props) {
  const anyRunning = compose.containers?.find((x) => x.State === "running");

  const { mutateAsync: stop } = useStopContainer();
  const { mutateAsync: start } = useStartContainer();
  const { mutateAsync: unpause } = useUnpauseContainer();

  function handleClick() {
    for (const container of compose.containers) {
      const running = container.State === "running";
      const paused = container.State === "paused";
      if ((running || paused) && anyRunning) stop(container.Id);
      else if (paused && !anyRunning) unpause(container.Id);
      else if (!running && !anyRunning) start(container.Id);
    }
  }

  return (
    <TooltipButton
      tooltipText={anyRunning ? "Stop" : "Start"}
      delayDuration={0}
      variant="ghost"
      onClick={handleClick}
    >
      {anyRunning && <IoStopSharp />}
      {!anyRunning && <IoMdPlay />}
    </TooltipButton>
  );
}
