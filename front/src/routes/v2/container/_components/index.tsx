import { ComposeIcon } from "@/components/container/v2/compose-icon";
import { ContainerIcon } from "@/components/container/v2/container-icon";
import { DataTable } from "@/components/data-table";
import InfiniteLoading from "@/components/infinite-loading";
import { TableCheckbox } from "@/components/table/checkbox";
import { Button } from "@/components/ui/button";
import { ExpandButton } from "@/table/container/components/expand-button";
import { SortableHeader } from "@/table/container/components/sortable-header";
import { getComposeStatus } from "@/table/container/helper";
import { Link } from "@tanstack/react-router";
import {
  ColumnDef,
  getCoreRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import {
  Compose,
  ContainerInfo,
  GrouppedContainer,
} from "~types/v2/container/list";

const columns: ColumnDef<GrouppedContainer>[] = [
  {
    id: "select",
    header: ({ table }) => <TableCheckbox table={table} position="header" />,
    cell: ({ row, table }) => (
      <TableCheckbox table={table} position="cell" row={row} />
    ),
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
      cellClass: "text-blue-500 font-bold cursor-pointer",
    },
  },
  {
    accessorKey: "Image",
    accessorFn: (row) => (row as ContainerInfo)?.Image,
    header({ column }) {
      return <SortableHeader name="Image" column={column} />;
    },
    cell({ row, getValue }) {
      const data = row.original as ContainerInfo;

      const id =
        data.Labels?.["com.docker.compose.image"]?.replace("sha256:", "") ||
        data.Image;

      return (
        <Link to="/images/$id" params={{ id }}>
          {getValue() as string}
        </Link>
      );
    },
    meta: {
      headerStyle: { width: "20%" },
      cellClass:
        "text-blue-500 underline underline-offset-4 font-bold cursor-pointer",
    },
  },
  {
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
    accessorKey: "Actions",
    cell({}) {
      return <Button>asd</Button>;
    },
    meta: {
      headerClass: "text-white",
      headerStyle: { width: "15%" },
    },
  },
];

type Props = {
  data: GrouppedContainer[];
};

export function ContainerTable({ data }: Props) {
  return (
    <DataTable
      columns={columns}
      data={data}
      getSubRows={(data) => (data as Compose)?.containers}
      getCoreRowModel={getCoreRowModel()}
      getExpandedRowModel={getExpandedRowModel()}
    />
  );
}
