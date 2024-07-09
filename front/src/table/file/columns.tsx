import { ColumnDef } from "@tanstack/react-table";
import { ExtendedFile } from "~types/file";
import { FaRegFolder, FaRegFile } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { LuFileSymlink } from "react-icons/lu";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import bytes from "bytes";
import { TimeAgo } from "@/components/timeago";
import { FileTableMetadata } from "./data-table";
import { FaSpinner } from "react-icons/fa";

type TData = ExtendedFile;

function getIcon(file: ExtendedFile) {
  let icon;

  switch (file.permission.fileType) {
    case "Directory":
      icon = <FaRegFolder />;
      break;

    case "Symbolic Link":
      icon = <LuFileSymlink />;
      break;

    default:
      icon = <FaRegFile />;
      break;
  }

  return icon;
}

export const columns: ColumnDef<TData>[] = [
  {
    id: "Name",
    header: "Name",
    meta: {
      headerClass: "w-full",
    },
    cell({ row, table }) {
      const visibility =
        row.original.permission.fileType === "Directory" ? "visible" : "hidden";

      const isExpanded = row?.getIsExpanded();
      const isLoading = row.original.isLoading;

      const { getFiles } = table.options.meta as FileTableMetadata;

      function handleExpand() {
        if (!row.original.childs) {
          getFiles(row.original.path);
        }
        row.toggleExpanded();
      }

      const Icon = getIcon(row.original);

      return (
        <div
          className="flex items-center"
          style={{ paddingLeft: `${row.depth / 2}rem` }}
        >
          <Button
            variant="ghost"
            className="p-0 mr-1 w-fit h-fit rounded-full hover:bg-transparent"
            onClick={handleExpand}
            style={{ cursor: "pointer", textAlign: "center", visibility }}
          >
            {isLoading && <FaSpinner className="animate-spin" />}
            {!isLoading && isExpanded && <ChevronDownIcon />}
            {!isLoading && !isExpanded && <ChevronRightIcon />}
          </Button>

          {Icon}
          <span className="ml-2"> {row.original.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell({ row }) {
      const value = row.original.size;
      return bytes(value, { unitSeparator: " " });
    },
    meta: {
      cellClass: "whitespace-nowrap",
    },
  },
  {
    accessorKey: "modify",
    header: "Modify",
    cell({ row }) {
      return <TimeAgo date={row.original.modify} />;
    },
    meta: {
      cellClass: "whitespace-nowrap",
    },
  },
  {
    accessorFn: (data) => data.permission.symbolic,
    header: "Mode",
  },
];
