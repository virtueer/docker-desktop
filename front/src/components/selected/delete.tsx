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
import { RowSelectionState } from "@tanstack/react-table";
import { useState } from "react";
import { getContainersByIds } from "./helper";
import { getContainerName } from "@/table/container/helper";
import { useDeleteContainer } from "@/api/v2/container/delete";

export default function SelectedDelete({
  rowSelection,
}: {
  rowSelection: RowSelectionState;
}) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const containers = getContainersByIds(Object.keys(rowSelection));
  const { mutateAsync: deleteContainer } = useDeleteContainer();

  async function handleDelete() {
    setDeleting(true);

    for (const container of containers) {
      deleteContainer(container.Id);
    }

    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="dark text-white bg-night-500 px-5 py-4">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete items?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="max-h-[40vh] overflow-auto scrollbar">
              The following items are selected for deletion:
              <ul className="text-white list-disc p-2 pl-4">
                {containers.map((container, index) => {
                  const text = `${getContainerName(container.Names)} (container)`;

                  return <li key={index}>{text}</li>;
                })}
              </ul>
              Any anonymous volumes associated with these containers are also
              deleted.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-night-500 hover:bg-night:400 border-blue-500 border-2">
            Cancel
          </AlertDialogCancel>
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
