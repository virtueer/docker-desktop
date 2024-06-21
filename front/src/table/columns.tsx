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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { EXITED_COLOR, PAUSED_COLOR, RUNNING_COLOR } from "@/constants";
import { ColumnDef } from "@tanstack/react-table";
import { FaPlay, FaStop, FaTrash } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { GoContainer } from "react-icons/go";
import { HiDotsVertical } from "react-icons/hi";
import { ImStack } from "react-icons/im";
import { IoEye, IoTerminal } from "react-icons/io5";
import { MdContentCopy, MdOutlineRestartAlt } from "react-icons/md";
import { PiFolderDuotone } from "react-icons/pi";
import { Compose, DockerPs } from "~types/ps";
import { ExpandButton } from "./expand-button";
import { getStatus } from "./helper";
import { SortableHeader } from "./sortable-header";

type TData = Compose | DockerPs;

export const columns: ColumnDef<TData>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          className="border-white"
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          className="border-white"
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Expandable",
    cell({ row }) {
      return (
        <div style={{ textAlign: "center" }}>
          <ExpandButton row={row} />
        </div>
      );
    },
  },
  {
    id: "Name",
    accessorFn: (row) => (row as Compose).name || (row as DockerPs).Names,
    header({ column }) {
      return <SortableHeader name="Name" column={column} />;
    },
    cell({ row }) {
      const name =
        (row.original as Compose).name || (row.original as DockerPs).Names;

      const isCompose = !!(row.original as Compose).name;

      let containerIconColor = "";
      switch (true) {
        case (row.original as DockerPs).State === "paused":
          containerIconColor = PAUSED_COLOR;
          break;

        case (row.original as DockerPs).State === "exited":
          containerIconColor = EXITED_COLOR;
          break;

        default:
          containerIconColor = RUNNING_COLOR;
          break;
      }

      let composeIconColor = "";
      const status = getStatus(row.original);
      switch (true) {
        case status.startsWith("Exited"):
          composeIconColor = EXITED_COLOR;
          break;

        case status.startsWith("Paused"):
          composeIconColor = PAUSED_COLOR;
          break;

        case !!(row.original as Compose).containers?.find(
          (x) => x.State !== "running"
        ):
          composeIconColor = PAUSED_COLOR;
          break;

        default:
          composeIconColor = RUNNING_COLOR;
          break;
      }

      return (
        <div className="flex items-center gap-3">
          <div style={{ paddingLeft: `${row.depth}rem` }}>
            {isCompose && <ImStack size="1.5rem" color={composeIconColor} />}
            {!isCompose && (
              <GoContainer size="1.5rem" color={containerIconColor} />
            )}
          </div>
          <span className="text-blue-500 underline underline-offset-4 font-bold cursor-pointer">
            {name}
          </span>
        </div>
      );
    },
    meta: {
      headerStyle: { width: "30%" },
      cellClass:
        "text-blue-500 underline underline-offset-4 font-bold cursor-pointer",
    },
  },
  {
    accessorKey: "Image",
    accessorFn: (row) => (row as DockerPs)?.Image,
    header({ column }) {
      return <SortableHeader name="Image" column={column} />;
    },
    // cell({ row }) {
    //   return (
    //     <span>{(row.original as DockerPs).Image}</span>
    //     // <div className="border cursor-pointer">
    //     //   <span className="text-blue-500 underline underline-offset-4 font-bold ">
    //     //     {(row.original as DockerPs).Image}
    //     //   </span>
    //     // </div>
    //   );
    // },
    meta: {
      headerStyle: { width: "20%" },
      cellClass:
        "text-blue-500 underline underline-offset-4 font-bold cursor-pointer",
    },
  },
  {
    accessorKey: "Status",
    header({ column }) {
      return <SortableHeader name="Status" column={column} />;
    },
    accessorFn: (row) => {
      return getStatus(row);
    },
    meta: {
      headerStyle: { width: "20%" },
    },
  },
  {
    accessorKey: "Ports",
    meta: {
      headerStyle: { width: "25%" },
    },
  },
  {
    accessorKey: "Actions",
    cell({ row }) {
      const status = getStatus(row.original);
      const running = status.startsWith("Up") || status.startsWith("Running");

      const alertDialogTitle = (row.original as Compose).name
        ? "Delete compose project?"
        : "Delete container?";

      const alertDialogDescription = (row.original as Compose).name
        ? `The '${(row.original as Compose).name}' compose project is selected for deletion.`
        : `The '${(row.original as DockerPs).Names}' container is selected for deletion. Any anonymous volumes associated with this container are also deleted.`;

      return (
        <div className="flex gap-0.5">
          <Button
            variant="ghost"
            className="p-2 rounded-full h-auto hover:bg-slate-300"
          >
            {running && <FaStop />}
            {!running && <FaPlay />}
          </Button>

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
    },
    meta: {
      headerStyle: { width: "15%" },
    },
  },
];
