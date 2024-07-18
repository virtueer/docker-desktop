import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { FaPause } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { IoEye } from "react-icons/io5";
import { MdOutlineRestartAlt } from "react-icons/md";
import { Compose } from "~types/container";
import { TooltipButton } from "../TooltipButton";

type Props = {
  compose: Compose;
};

export default function ComposeThreeDots({ compose }: Props) {
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
        <Link to={"/compose/$name"} params={{ name: compose!.name }}>
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <IoEye size="1.2rem" />
            View Details
          </DropdownMenuItem>
        </Link>
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
