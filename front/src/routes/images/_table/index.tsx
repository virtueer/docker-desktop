import { DataTable } from "@/components/data-table";
import {
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  RowSelectionState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { MdContentCopy } from "react-icons/md";
import { Image } from "~types/image";

const columns: ColumnDef<Image>[] = [
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
    accessorKey: "Repository",
    cell({ row }) {
      const value = row.original.Repository;
      const ID = row.original.ID.replace("sha256:", "");

      return (
        <Link
          className="flex flex-col gap-1 h-[50px] justify-center text-blue-500 font-bold cursor-pointer px-1 hover:bg-slate-700"
          to="/images/$id"
          params={{ id: ID }}
        >
          <span className="underline underline-offset-4">{value}</span>
          <span
            className="flex gap-1 items-center text-white text-xs w-fit"
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(ID);
            }}
          >
            {ID.slice(0, 12)}
            <Button
              variant="ghost"
              className="p-0 hover:bg-transparent focus:text-red-200 h-fit"
            >
              <MdContentCopy />
            </Button>
          </span>
        </Link>
      );
    },
    meta: {
      cellClass: "p-0",
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
    cell({ getValue }) {
      return (getValue() as string).replace(/(\d+\.?\d*)([A-Za-z]+)/, "$1 $2"); // 1.21GB -> 1.21 GB
    },
  },
];

type Props = {
  data: Image[];
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
};

export default function ImageTable({
  data,
  rowSelection,
  setRowSelection,
}: Props) {
  return (
    <DataTable
      columns={columns}
      data={data}
      getCoreRowModel={getCoreRowModel()}
      getSortedRowModel={getSortedRowModel()}
      onRowSelectionChange={setRowSelection}
      state={{
        rowSelection,
      }}
    />
  );
}
