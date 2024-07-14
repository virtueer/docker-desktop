import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { FaPause } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { IoEye, IoTerminal } from "react-icons/io5";
import { MdContentCopy, MdOutlineRestartAlt } from "react-icons/md";
import { PiFolderDuotone } from "react-icons/pi";
import { ContainerInfo } from "~types/v2/container/list";
import { TooltipButton } from "../TooltipButton";

type Props = {
  container: ContainerInfo;
};

export default function ContainerThreeDots({ container }: Props) {
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
      <DropdownMenuContent className="dark">
        <Link to="/container/$id" params={{ id: container.Id }}>
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <IoEye size="1.2rem" />
            View Details
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="gap-2">
          <MdContentCopy size="1.2rem" />
          Copy docker run
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <IoTerminal size="1.2rem" />
          Open in terminal
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <PiFolderDuotone size="1.2rem" />
          View files
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <FaPause size="1.2rem" />
          Pause
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <MdOutlineRestartAlt size="1.2rem" />
          Restart
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
