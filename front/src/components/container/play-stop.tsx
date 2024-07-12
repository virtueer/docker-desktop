import { Button } from "@/components/ui/button";
import { FaPlay, FaStop } from "react-icons/fa";

import { ContainerInfo } from "~types/v2/container/list";

type Props = {
  container: ContainerInfo;
};

export default function ContainerPlayStop({ container }: Props) {
  const running = container.State === "running";

  function handleClick() {}

  return (
    <Button
      variant="ghost"
      className="p-2 rounded-full h-auto hover:bg-slate-300"
      onClick={handleClick}
      disabled={container.loading}
    >
      {running && <FaStop />}
      {!running && <FaPlay />}
    </Button>
  );
}
