import { ComposeIcon } from "@/components/container/compose-icon";
import { ContainerIcon } from "@/components/container/container-icon";
import { DataTable } from "@/components/data-table";
import InfiniteLoading from "@/components/infinite-loading/infinite-loading";
import { TableCheckbox } from "@/components/table/checkbox";
import { ExpandButton } from "@/components/table/expand-button";
import { SortableHeader } from "@/components/table/sortable-header";
import { getComposeStatus, getImageId } from "@/components/table/helper";
import { Link } from "@tanstack/react-router";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  OnChangeFn,
  RowSelectionState,
} from "@tanstack/react-table";
import { Compose, ContainerInfo, GrouppedContainer } from "~types/container/";
import { Actions } from "./actions";

const multiColumnFilterFn: FilterFn<GrouppedContainer> = (
  row,
  _,
  filterValue
) => {
  const container = row.original as ContainerInfo;
  const searchableRowContent = `${container.Id} ${container.Names} ${container.Image}`;

  return (
    (row.original as Compose).name
      ?.toLowerCase()
      .includes(filterValue.toLowerCase()) ||
    searchableRowContent.toLowerCase().includes(filterValue.toLowerCase())
  );
};

const columns: ColumnDef<GrouppedContainer>[] = [
  {
    id: "select",
    header: ({ table }) => <TableCheckbox table={table} position="header" />,
    cell: ({ row, table }) => (
      <TableCheckbox table={table} position="cell" row={row} />
    ),
    meta: {
      cellClass: "p-2 h-[50px]",
    },
    filterFn: multiColumnFilterFn,
  },
  {
    id: "Expandable",
    cell({ row }) {
      return (
        <div style={{ textAlign: "center" }}>
          <ExpandButton row={row} />
        </div>
      );
    },
    meta: {
      cellClass: "p-2",
    },
  },
  {
    id: "Name",
    accessorFn: (row) => (row as Compose).name || (row as ContainerInfo).Names,
    header({ column }) {
      return <SortableHeader name="Name" column={column} />;
    },
    cell({ row }) {
      const isCompose = !!(row.original as Compose).name;

      if (isCompose)
        return (
          <ComposeIcon compose={row.original as Compose} depth={row.depth} />
        );

      return (
        <ContainerIcon
          container={row.original as ContainerInfo}
          depth={row.depth}
        />
      );
    },
    meta: {
      headerStyle: { width: "30%" },
    },
  },
  {
    id: "Image",
    accessorFn: (row) => (row as ContainerInfo)?.Image,
    header({ column }) {
      return <SortableHeader name="Image" column={column} />;
    },
    cell({ row, getValue }) {
      const data = row.original as ContainerInfo;

      const id = getImageId(data.ImageID);

      return (
        <Link
          to="/images/$id"
          params={{ id }}
          className="h-[50px] text-blue-500 underline underline-offset-4 font-bold flex items-center drag-none"
        >
          {getValue() as string}
        </Link>
      );
    },
    meta: {
      headerStyle: { width: "20%" },
    },
  },
  {
    id: "Status",
    accessorKey: "Status",
    header({ column }) {
      return <SortableHeader name="Status" column={column} />;
    },
    accessorFn: (data) => {
      const isCompose = !!(data as Compose).name;
      return isCompose
        ? getComposeStatus(data as Compose)
        : (data as ContainerInfo).Status;
    },
    cell({ row, column }) {
      const isLoading = (row.original as ContainerInfo).loading;

      return isLoading ? (
        <InfiniteLoading width="100px" />
      ) : (
        row.getValue(column.id)
      );
    },
    meta: {
      headerStyle: { width: "20%" },
    },
  },
  {
    id: "Ports",
    accessorFn: (data) => (data as ContainerInfo)?.Ports,
    cell({ row }) {
      const ports = (row.original as ContainerInfo).Ports?.filter(
        (x) => x.PrivatePort && x.PublicPort
      );
      if (!ports) return <></>;

      return (
        <ul>
          {ports.map((port) => (
            <li>
              {port.PublicPort}:{port.PrivatePort}
            </li>
          ))}
        </ul>
      );
    },
    meta: {
      headerClass: "text-white",
      headerStyle: { width: "25%" },
    },
  },
  {
    id: "State",
    accessorKey: "State",
  },
  {
    accessorKey: "Actions",
    cell({ row }) {
      return <Actions row={row} />;
    },
    meta: {
      headerClass: "text-white",
      headerStyle: { width: "15%" },
    },
  },
];

type Props = {
  data: GrouppedContainer[];
  columnFilters: ColumnFiltersState;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
};

export function ContainerTable({
  data,
  columnFilters,
  setColumnFilters,
  setRowSelection,
  rowSelection,
}: Props) {
  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(data) => (data as ContainerInfo).Id || (data as Compose).name}
      getSubRows={(data) => (data as Compose)?.containers}
      getCoreRowModel={getCoreRowModel()}
      getExpandedRowModel={getExpandedRowModel()}
      getFilteredRowModel={getFilteredRowModel()}
      onColumnFiltersChange={setColumnFilters}
      onRowSelectionChange={setRowSelection}
      state={{
        columnVisibility: { State: false },
        columnFilters,
        rowSelection,
      }}
    />
  );
}
