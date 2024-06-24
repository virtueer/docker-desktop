import { deleteContainer } from "@/api/delete-container";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Compose, DockerPs } from "~types/ps";

export default function Delete({ table }: { table: Table<any> }) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const selectedRows = useMemo(
    () => table.getSelectedRowModel().flatRows,
    [deleting, open]
  );

  async function handleDelete() {
    setDeleting(true);

    const containers = selectedRows
      .filter((row) => !row.original.name)
      .map((x) => x.original) as DockerPs[];

    const promises = [];
    for (const container of containers) {
      console.log(container.ID);
      promises.push(deleteContainer(container.ID));
    }

    promises.push(new Promise((r) => setTimeout(r, 5000)));
    await Promise.all(promises);
    table.resetRowSelection();
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="dark text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete items?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              The following items are selected for deletion:
              <ul className="list-disc pl-4 pt-2">
                {selectedRows.map((row, index) => {
                  const compose = row.original as Compose;
                  const dockerPs = row.original as DockerPs;

                  const text = compose?.name
                    ? `${compose.name} (compose stack)`
                    : `${dockerPs.Names} (container)`;

                  return <li key={index}>{text}</li>;
                })}
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            className="bg-red-600 hover:bg-red-500 text-white"
            onClick={handleDelete}
          >
            {deleting ? "Deleting..." : "Delete forever"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
