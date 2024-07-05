import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, Row } from "@tanstack/react-table";

type CellProps = {
  row: Row<any>;
  position: "cell";
};

type HeaderProps = {
  row?: Row<any>;
  position: "header";
};

type BaseProps = {
  table: Table<any>;
};

type Props = BaseProps & (HeaderProps | CellProps);

const TableCheckbox = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  Props & React.ComponentPropsWithoutRef<typeof Checkbox>
>(({ table, row, position, className, ...props }, ref) => {
  const checkedHeader =
    table.getIsAllPageRowsSelected() ||
    (table.getIsSomePageRowsSelected() && "indeterminate");

  const checkedCell = row?.getIsSelected();

  const checked =
    props.checked || position === "header" ? checkedHeader : checkedCell;

  const onCheckedChangeHeader = (value: boolean | "indeterminate") =>
    table.toggleAllPageRowsSelected(!!value);
  const onCheckedChangeCell = (value: boolean | "indeterminate") =>
    row?.toggleSelected(!!value);

  const onCheckedChange =
    props.onCheckedChange || position === "header"
      ? onCheckedChangeHeader
      : onCheckedChangeCell;

  const ariaLabel =
    props["aria-label"] || position === "header" ? "Select all" : "Select row";

  return (
    <Checkbox
      className="border-white"
      {...props}
      onCheckedChange={onCheckedChange}
      aria-label={ariaLabel}
      checked={checked}
      ref={ref}
    />
  );
});
TableCheckbox.displayName = Checkbox.displayName;

export { TableCheckbox };
