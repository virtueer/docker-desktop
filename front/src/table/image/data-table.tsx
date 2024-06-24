import { DataTable, DataTableProps } from "@/components/data-table";
import { getCoreRowModel, getSortedRowModel } from "@tanstack/react-table";
import React from "react";

export default function ImageTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});

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
