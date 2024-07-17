import { DataTable } from "@/components/data-table";
import {
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  RowSelectionState,
} from "@tanstack/react-table";

import CopyableId from "@/components/copyable-id";
import { getImageId } from "@/components/table/helper";
import { TimeAgo } from "@/components/timeago";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import bytes from "bytes";
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
    id: "Name",
    header: "Name",
    cell({ row }) {
      const value = row.original.RepoTags?.[0]?.split(":")[0] || "<none>";
      const ID = getImageId(row.original.Id);

      return (
        <Link
          className="flex flex-col gap-1 h-[50px] justify-center text-blue-500 font-bold cursor-pointer px-1 hover:bg-slate-700"
          to="/images/$id"
          params={{ id: ID }}
        >
          <span className="underline underline-offset-4">{value}</span>
          <CopyableId id={row.original.Id.slice(7)} />
        </Link>
      );
    },
    meta: {
      cellClass: "p-0",
    },
  },
  {
    id: "Tag",
    header: "Tag",
    cell({ row }) {
      return row.original.RepoTags?.[0]?.split(":")[1] || "latest";
    },
  },
  {
    accessorKey: "Created",
    header: "Created",
    cell({ row }) {
      return <TimeAgo date={row.original.Created * 1000} />;
    },
  },
  {
    accessorKey: "Size",
    header: "Size",
    cell({ row }) {
      return bytes(row.original.Size, { unitSeparator: " " });
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
