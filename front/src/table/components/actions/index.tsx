import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { FaTrash } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { IoEye, IoTerminal } from "react-icons/io5";
import { MdContentCopy, MdOutlineRestartAlt } from "react-icons/md";
import { PiFolderDuotone } from "react-icons/pi";
import { Compose, DockerPs } from "~types/ps";

import { Row, Table } from "@tanstack/react-table";
import PlayStop from "./play-stop";

export function Actions({ row, table }: { row: Row<any>; table: Table<any> }) {
  const isCompose = !!(row.original as any).name;
  const dockerPs = row.original as DockerPs;
  const compose = row.original as Compose;

  const alertDialogTitle = compose.name
    ? "Delete compose project?"
    : "Delete container?";

  const alertDialogDescription = compose.name
    ? `The '${compose.name}' compose project is selected for deletion.`
    : `The '${dockerPs.Names}' container is selected for deletion. Any anonymous volumes associated with this container are also deleted.`;

  return (
    <div className="flex gap-0.5">
      <PlayStop
        isCompose={isCompose}
        dockerPs={dockerPs}
        row={row}
        table={table}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-2 rounded-full h-auto hover:bg-slate-300"
          >
            <HiDotsVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="gap-2">
            <IoEye size="1.2rem" />
            View Details
          </DropdownMenuItem>
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

      <Separator orientation="vertical" className="h-auto" />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className="p-2 rounded-full h-auto hover:bg-slate-300"
          >
            <FaTrash />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertDialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertDialogDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-500">
              Delete forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
