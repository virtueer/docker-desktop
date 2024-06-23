import {
  Cell,
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  FilterFn,
  Header,
  Row,
  SortingState,
  Table as TanstackTable,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import React from "react";
import { FaSearch } from "react-icons/fa";
import { Compose } from "~types/ps";
import { useTableRowsMetadata } from "./metadata";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export type TableMetadata = {
  rowsMetadata: ReturnType<typeof useTableRowsMetadata>;
};

declare module "@tanstack/react-table" {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  for (const subRow of row.subRows) {
    const itemRank = rankItem(subRow.getValue(columnId), value);

    addMeta({
      itemRank,
    });

    if (itemRank.passed) return itemRank.passed;
  }

  const parentRow = row.getParentRow();
  if (parentRow) {
    const itemRank = rankItem(parentRow.getValue(columnId), value);

    addMeta({
      itemRank,
    });

    if (itemRank.passed) return itemRank.passed;
  }

  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

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
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: "fuzzy",
    state: {
      rowSelection,
      expanded,
      sorting,
      globalFilter,
      columnFilters,
    },
    meta,
  });

  return (
    <div className="rounded-md">
      <div className="flex items-center mb-5 gap-5">
        <div className="flex items-center  px-3 border rounded w-fit">
          <FaSearch />
          <Input
            placeholder="Search"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(String(e.target.value))}
            className="border-none w-[300px]"
            style={{ boxShadow: "none" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            onCheckedChange={(value) => {
              setColumnFilters(
                value ? [{ id: "select", value: "running" }] : []
              );
            }}
            className="dark"
          />
          Only show running containers
        </div>
      </div>
      <Table className="dark">
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
