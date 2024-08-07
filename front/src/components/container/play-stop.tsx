import { useStartContainer } from "@/api/container/start";
import { useStopContainer } from "@/api/container/stop";
import { useUnpauseContainer } from "@/api/container/unpause";
import { IoMdPlay } from "react-icons/io";
import { IoStopSharp } from "react-icons/io5";
import { ContainerInfo } from "~types/container";
import { TooltipButton } from "../TooltipButton";

type Props = {
  container: ContainerInfo;
};

export default function ContainerPlayStop({ container }: Props) {
  const running = container.State === "running";
  const paused = container.State === "paused";

  const { mutateAsync: stop } = useStopContainer();
  const { mutateAsync: start } = useStartContainer();
  const { mutateAsync: unpause } = useUnpauseContainer();

  function handleClick() {
    if (running) stop(container.Id);
    else if (paused) unpause(container.Id);
    else if (!running) start(container.Id);
  }

  return (
    <TooltipButton
      tooltipText={running ? "Stop" : "Start"}
      delayDuration={0}
      variant="ghost"
      onClick={handleClick}
      disabled={container.loading}
    >
      {running && <IoStopSharp />}
      {!running && <IoMdPlay />}
    </TooltipButton>
  );
}
