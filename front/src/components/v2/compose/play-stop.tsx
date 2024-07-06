import { Button } from "@/components/ui/button";
import { FaPlay, FaStop } from "react-icons/fa";

import { Compose } from "~types/v2/container/list";

type Props = {
  compose: Compose;
};

export default function ComposePlayStop({ compose }: Props) {
  const allRunning = compose.containers?.find((x) => x.State !== "running");

  function handleClick() {}

  return (
    <Button
      variant="ghost"
      className="p-2 rounded-full h-auto hover:bg-slate-300"
      onClick={handleClick}
    >
      {allRunning && <FaPlay />}
      {!allRunning && <FaStop />}
    </Button>
  );
}
