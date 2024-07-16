import { Table } from "@tanstack/react-table";
import Actions from "./actions";
import Delete from "./delete";

export default function SelectedActions({ table }: { table: Table<any> }) {
  return (
    <div className="flex gap-5 items-center">
      <Delete table={table} />

      <Actions table={table} />
    </div>
  );
}
