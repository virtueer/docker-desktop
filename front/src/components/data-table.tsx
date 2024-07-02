import {
  Cell,
  ColumnDef,
  Header,
  Row,
  TableOptions,
  Table as TanstackTable,
  flexRender,
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

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData>(options: TableOptions<TData>) {
  const table = useReactTable(options);

  return (
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
      colSpan={header.colSpan}
      className={cn("text-nowrap", meta?.headerClass)}
      style={{ ...meta?.headerStyle }}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </TableHead>
  );
}
