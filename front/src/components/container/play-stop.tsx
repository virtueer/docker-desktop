import { IoMdPlay } from "react-icons/io";
import { IoStopSharp } from "react-icons/io5";
import { ContainerInfo } from "~types/v2/container/list";
import { TooltipButton } from "../TooltipButton";
import { useStopContainer } from "@/api/v2/container/stop";
import { useStartContainer } from "@/api/v2/container/start";

type Props = {
  container: ContainerInfo;
};

export default function ContainerPlayStop({ container }: Props) {
  const running = container.State === "running";

  const { mutateAsync: stop } = useStopContainer();
  const { mutateAsync: start } = useStartContainer();

  function handleClick() {
    if (running) stop(container.Id);
    if (!running) start(container.Id);
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
