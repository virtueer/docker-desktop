import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  RowSelectionState,
} from "@tanstack/react-table";
import { Volume } from "~types/volume";

const columns: ColumnDef<Volume>[] = [
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

type Props = {
  data: Volume[];
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
};

export default function VolumeTable({
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
