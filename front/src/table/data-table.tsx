import {
  Cell,
  ColumnDef,
  ExpandedState,
  Header,
  Row,
  SortingState,
  Table as TanstackTable,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import React from "react";
import { Compose } from "~types/ps";
import { useTableRowsMetadata } from "./metadata";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function CustomTableRow({ row }: { row: Row<any> }) {
  return (
    <TableRow data-state={row.getIsSelected() && "selected"}>
      {row.getVisibleCells().map((cell) => (
        <CustomTableCell key={cell.id} cell={cell} />
      ))}
    </TableRow>
  );
}

function CustomTableBody({ table }: { table: TanstackTable<any> }) {
  const rowModel = table.getRowModel();

  if (rowModel.rows?.length) {
    return rowModel.rows.map((row) => (
      <CustomTableRow key={row.id} row={row} />
    ));
  }

  return (
    <TableRow>
      <TableCell colSpan={99} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  );
}

function CustomTableCell({ cell }: { cell: Cell<any, unknown> }) {
  const meta = cell.column.columnDef.meta as any;

  return (
    <TableCell key={cell.id} className={meta?.cellClass}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
}

function CustomTableHead({ header }: { header: Header<any, unknown> }) {
  const meta = header.column.columnDef.meta as any;

  return (
    <TableHead
      className={cn("text-nowrap", meta?.headerClass)}
      style={{ ...meta?.headerStyle }}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </TableHead>
  );
}

export type TableMetadata = {
  rowsMetadata: ReturnType<typeof useTableRowsMetadata>;
};

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const rowsMetadata = useTableRowsMetadata();

  const meta: TableMetadata = {
    rowsMetadata,
  };

  const table = useReactTable({
    data,
    columns,
    getSubRows: (row) => (row as Compose).containers as TData[],
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    state: {
      rowSelection,
      expanded,
      sorting,
    },
    meta,
  });

  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return <CustomTableHead header={header} key={header.id} />;
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          <CustomTableBody table={table} />
        </TableBody>
      </Table>
    </div>
  );
}
