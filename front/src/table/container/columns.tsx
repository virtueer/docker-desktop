import InfiniteLoading from "@/components/infinite-loading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EXITED_COLOR, PAUSED_COLOR, RUNNING_COLOR } from "@/constants";
import { ColumnDef } from "@tanstack/react-table";
import { GoContainer } from "react-icons/go";
import { ImStack } from "react-icons/im";
import { MdContentCopy } from "react-icons/md";
import { Compose, DockerPs } from "~types/ps";
import { Actions } from "./components/actions";
import { ExpandButton } from "./components/expand-button";
import { SortableHeader } from "./components/sortable-header";
import { TableMetadata } from "./data-table";
import { getContainerColor, getStatus } from "./helper";
import { Link } from "@tanstack/react-router";

type TData = Compose | DockerPs;

export const columns: ColumnDef<TData>[] = [
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
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
    filterFn: (row, _, filterValue) => {
      for (const subRow of row.subRows) {
        const pass = (subRow.original as DockerPs).State === filterValue;

        if (pass) return true;
      }

      return (row.original as any).State === filterValue;
    },
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
    accessorFn: (row) => (row as Compose).name || (row as DockerPs).Names,
    header({ column }) {
      return <SortableHeader name="Name" column={column} />;
    },
    cell({ row }) {
      const compose = row.original as Compose;
      const dockerPs = row.original as DockerPs;

      const name = compose?.name || dockerPs.Names;
      const isCompose = !!compose.name;

      let containerIconColor = getContainerColor(dockerPs);

      let composeIconColor = "";
      const status = getStatus(row.original);
      switch (true) {
        case status.startsWith("Exited"):
          composeIconColor = EXITED_COLOR;
          break;

        case status.startsWith("Paused"):
          composeIconColor = PAUSED_COLOR;
          break;

        case !!compose.containers?.find((x) => x.State !== "running"):
          composeIconColor = PAUSED_COLOR;
          break;

        default:
          composeIconColor = RUNNING_COLOR;
          break;
      }

      return (
        <Link
          to={isCompose ? "/compose/$name" : "/container/$id"}
          params={isCompose ? { name: compose.name } : { id: dockerPs.ID }}
        >
          <div className="flex items-center gap-3">
            <div style={{ paddingLeft: `${row.depth}rem` }}>
              {isCompose && <ImStack size="1.5rem" color={composeIconColor} />}
              {!isCompose && (
                <GoContainer size="1.5rem" color={containerIconColor} />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="underline underline-offset-4">{name}</span>
              {(row.original as DockerPs).ID && (
                <span
                  className="flex gap-1 items-center text-white text-xs w-fit"
                  onClick={() =>
                    navigator.clipboard.writeText((row.original as DockerPs).ID)
                  }
                >
                  {(row.original as DockerPs).ID.slice(0, 12)}
                  <Button
                    variant="ghost"
                    className="p-0 hover:bg-transparent focus:text-red-200 h-fit"
                  >
                    <MdContentCopy />
                  </Button>
                </span>
              )}
            </div>
          </div>
        </Link>
      );
    },
    meta: {
      headerStyle: { width: "30%" },
      cellClass: "text-blue-500 font-bold cursor-pointer",
    },
  },
  {
    accessorKey: "Image",
    accessorFn: (row) => (row as DockerPs)?.Image,
    header({ column }) {
      return <SortableHeader name="Image" column={column} />;
    },
    cell({ row, getValue }) {
      const data = row.original as DockerPs;

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
    accessorFn: (row) => {
      return getStatus(row);
    },
    cell({ row, column, table }) {
      const { rowsMetadata } = table.options.meta as TableMetadata;
      const isLoading = rowsMetadata.isRowLoading(row.id);

      if (isLoading) {
        return <InfiniteLoading width="100px" />;
      }

      return row.getValue(column.id);
    },
    meta: {
      headerStyle: { width: "20%" },
    },
  },
  {
    accessorKey: "Ports",
    meta: {
      headerClass: "text-white",
      headerStyle: { width: "25%" },
    },
  },
  {
    accessorKey: "Actions",
    cell({ row, table }) {
      return <Actions row={row} table={table} />;
    },
    meta: {
      headerClass: "text-white",
      headerStyle: { width: "15%" },
    },
  },
];
