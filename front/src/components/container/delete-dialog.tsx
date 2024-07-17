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
import { FaTrash } from "react-icons/fa";
import { ContainerInfo } from "~types/v2/container/list";
import { TooltipButton } from "../TooltipButton";
import { cn } from "@/lib/utils";
import { getContainerName } from "@/components/table/helper";
import { useDeleteContainer } from "@/api/container/delete";

type Props = {
  container: ContainerInfo;
  children?: JSX.Element;
  className?: string;
};

export default function ContainerDeleteDialog({
  container,
  children,
  className,
}: Props) {
  const alertDialogTitle = "Delete container?";

  const alertDialogDescription = `The '${getContainerName(container!.Names)}' container is selected for deletion. Any anonymous volumes associated with this container are also deleted.`;

  const { mutateAsync: deleteContainer } = useDeleteContainer();

  function handleDelete() {
    deleteContainer(container.Id);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        {children ? (
          children
        ) : (
          <TooltipButton
            tooltipText="Delete"
            variant="ghost"
            className={cn("hover:text-red-500", className)}
          >
            <FaTrash />
          </TooltipButton>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="dark text-white p-4 bg-night-500">
        <AlertDialogHeader>
          <AlertDialogTitle>{alertDialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {alertDialogDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-blue-500 border-2 rounded-sm bg-transparent">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-500 text-white"
            onClick={handleDelete}
          >
            Delete forever
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
