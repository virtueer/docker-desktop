import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { MdContentCopy } from "react-icons/md";
import { Image } from "~types/image";

type TData = Image;

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
  },
  {
    accessorKey: "Repository",
    cell({ row }) {
      const value = row.original.Repository;
      const ID = row.original.ID.replace("sha256:", "");

      return (
        <div className="flex flex-col gap-1 text-blue-500 font-bold cursor-pointer">
          <span className="underline underline-offset-4">{value}</span>
          <span
            className="flex gap-1 items-center text-white text-xs"
            onClick={() => navigator.clipboard.writeText(ID)}
          >
            {ID.slice(0, 12)}
            <Button
              variant="ghost"
              className="p-0 hover:bg-transparent focus:text-red-200 h-fit"
            >
              <MdContentCopy />
            </Button>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "Tag",
  },
  {
    accessorKey: "CreatedSince",
    header: "Created",
  },
  {
    accessorKey: "VirtualSize",
    header: "Size",
  },
];
