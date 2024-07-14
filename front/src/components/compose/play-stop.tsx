import { IoMdPlay } from "react-icons/io";
import { IoStopSharp } from "react-icons/io5";

import { Compose } from "~types/v2/container/list";
import { TooltipButton } from "../TooltipButton";

type Props = {
  compose: Compose;
};

export default function ComposePlayStop({ compose }: Props) {
  const allRunning = compose.containers?.find((x) => x.State !== "running");

  function handleClick() {}

  return (
    <TooltipButton
      tooltipText={!allRunning ? "Stop" : "Start"}
      delayDuration={0}
      variant="ghost"
      onClick={handleClick}
    >
      {!allRunning && <IoStopSharp />}
      {allRunning && <IoMdPlay />}
    </TooltipButton>
  );
}
