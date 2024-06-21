import { FaArrowUp, FaArrowDown } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";

export function SortableHeader({
  name,
  column,
}: {
  name: string;
  column: Column<any, unknown>;
}) {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start px-0 text-white hover:bg-inherit"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {name}
      {column.getIsSorted() === "asc" && <FaArrowUp className="ml-2" />}
      {column.getIsSorted() === "desc" && <FaArrowDown className="ml-2" />}
    </Button>
  );
}
