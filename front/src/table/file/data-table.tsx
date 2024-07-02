import { DataTable, DataTableProps } from "@/components/data-table";
import { getCoreRowModel, getExpandedRowModel } from "@tanstack/react-table";
import { ExtendedFile } from "~types/file";
import { useTableRowsMetadata } from "../container/metadata";

export default function FileTable<TValue>({
  columns,
  data,
  getFiles,
}: DataTableProps<ExtendedFile, TValue> & {
  getFiles: (path: string) => void;
}) {
  const rowsMetadata = useTableRowsMetadata();

  return (
    <DataTable
      columns={columns}
      data={data}
      getSubRows={(data) => data.childs}
      getCoreRowModel={getCoreRowModel()}
      getExpandedRowModel={getExpandedRowModel()}
      meta={{
        rowsMetadata,
        getFiles,
      }}
    />
  );
}
