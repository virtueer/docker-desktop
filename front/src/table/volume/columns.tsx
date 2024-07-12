import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Volume } from "~types/volume";

type TData = Volume;

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
    meta: {
      cellClass: "p-2",
    },
  },
  {
    accessorKey: "Name",
    meta: {
      cellClass:
        "underline underline-offset-2 text-blue-500 font-bold cursor-pointer",
    },
  },
  {
    accessorKey: "Status",
  },
];
