import { DataTable, DataTableProps } from "@/components/data-table";
import { getCoreRowModel, getExpandedRowModel } from "@tanstack/react-table";
import { ExtendedFile } from "~types/file";

export type FileTableMetadata = {
  getFiles: (path: string) => void;
};

export default function FileTable<TValue>({
  columns,
  data,
  getFiles,
}: DataTableProps<ExtendedFile, TValue> & {
  getFiles: (path: string) => void;
}) {
  return (
    <DataTable
      columns={columns}
      data={data}
      getSubRows={(data) => data.childs}
      getCoreRowModel={getCoreRowModel()}
      getExpandedRowModel={getExpandedRowModel()}
      meta={{
        getFiles,
      }}
    />
  );
}
