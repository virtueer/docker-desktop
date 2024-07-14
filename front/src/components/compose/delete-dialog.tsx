import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import { Compose } from "~types/v2/container/list";
import { TooltipButton } from "../TooltipButton";

type Props = {
  compose: Compose;
};

export default function ComposeDeleteDialog({ compose }: Props) {
  const alertDialogTitle = "Delete compose project?";

  const alertDialogDescription = `The '${compose!.name}' compose project is selected for deletion.`;

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <TooltipButton
          tooltipText="Delete"
          variant="ghost"
          className="hover:text-red-500"
        >
          <FaTrash />
        </TooltipButton>
      </AlertDialogTrigger>
      <AlertDialogContent className="dark text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>{alertDialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {alertDialogDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-600 hover:bg-red-500 text-white">
            Delete forever
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
