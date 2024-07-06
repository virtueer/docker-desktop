import { Button } from "@/components/ui/button";
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
import { Compose } from "~types/v2/container/list";

type Props = {
  compose: Compose;
};

export default function ComposeThreeDots({ compose }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-2 rounded-full h-auto hover:bg-slate-300"
        >
          <HiDotsVertical />
        </Button>
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
