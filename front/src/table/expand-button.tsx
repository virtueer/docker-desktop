import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

export function ExpandButton({ row }: { row: Row<any> }) {
  const expandable = row.getCanExpand();

  if (expandable) {
    const expanded = row.getIsExpanded();

    return (
      <Button
        variant="ghost"
        className="p-1 w-fit h-fit rounded-full hover:bg-slate-300 hover:text-sky-600"
        onClick={row.getToggleExpandedHandler()}
        style={{ cursor: "pointer", textAlign: "center" }}
      >
        {expanded && <ChevronDownIcon />}
        {!expanded && <ChevronRightIcon />}
      </Button>
    );
  }

  return <></>;
}
