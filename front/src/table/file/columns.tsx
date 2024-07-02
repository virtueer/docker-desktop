import { ColumnDef } from "@tanstack/react-table";
import { ExtendedFile } from "~types/file";
import { FaRegFolder, FaRegFile } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { LuFileSymlink } from "react-icons/lu";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import bytes from "bytes";
import { TimeAgo } from "@/components/timeago";

type TData = ExtendedFile;

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

      function handleExpand() {
        console.log(table);
        if (!row.original.childs) {
          (table.options.meta as any)?.getFiles(row.original.path);
        }
        row.toggleExpanded();
      }

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
            {isExpanded && <ChevronDownIcon />}
            {!isExpanded && <ChevronRightIcon />}
          </Button>

          <>
            {row.original.permission.fileType === "Directory" && (
              <FaRegFolder />
            )}
            {row.original.permission.fileType === "Regular File" && (
              <FaRegFile />
            )}
            {row.original.permission.fileType === "Symbolic Link" && (
              <LuFileSymlink />
            )}
          </>
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
