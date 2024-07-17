import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "@tanstack/react-router";
import { ComponentProps } from "react";
import { IconType } from "react-icons";
import { FaPause } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { IoEye, IoTerminal } from "react-icons/io5";
import { MdOutlineRestartAlt } from "react-icons/md";
import { PiFolderDuotone } from "react-icons/pi";
import { ContainerInfo } from "~types/v2/container/list";
import { TooltipButton } from "../TooltipButton";
import { TabsEnum } from "@/constants";
import { usePauseContainer } from "@/api/container/pause";
import { useRestartContainer } from "@/api/container/restart";

const Item = ({
  Icon,
  text,
  ...props
}: { Icon: IconType; text: string } & ComponentProps<
  typeof DropdownMenuItem
>) => {
  return (
    <DropdownMenuItem
      className="gap-5 cursor-pointer disabled:cursor-default hover:bg-slate-500 focus:bg-slate-500"
      {...props}
    >
      <Icon size="1.2rem" />
      {text}
    </DropdownMenuItem>
  );
};

type Props = {
  container: ContainerInfo;
};

export default function ContainerThreeDots({ container }: Props) {
  const navigate = useNavigate();
  const running = container.State === "running";
  const paused = container.State === "paused";

  const { mutateAsync: pause } = usePauseContainer();
  const { mutateAsync: restart } = useRestartContainer();

  function handlePause() {
    pause(container.Id);
  }

  function handleRestart() {
    restart(container.Id);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger style={{ boxShadow: "none", outline: "none" }}>
        <TooltipButton
          tooltipText="Show container actions"
          delayDuration={0}
          variant="ghost"
        >
          <HiDotsVertical />
        </TooltipButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark bg-night-400">
        <Item
          Icon={IoEye}
          text="View Details"
          onClick={() => navigate({ to: `/container/${container.Id}` })}
        />
        <Item
          Icon={IoTerminal}
          text="Open in terminal"
          onClick={() =>
            navigate({ to: `/container/${container.Id}?tab=${TabsEnum.EXEC}` })
          }
          disabled={!running}
        />
        <Item
          Icon={PiFolderDuotone}
          text="View files"
          onClick={() =>
            navigate({ to: `/container/${container.Id}?tab=${TabsEnum.FILES}` })
          }
          disabled={!running}
        />
        <Item
          Icon={FaPause}
          text="Pause"
          disabled={paused || !running}
          onClick={handlePause}
        />
        <Item
          Icon={MdOutlineRestartAlt}
          text="Restart"
          disabled={!running}
          onClick={handleRestart}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
