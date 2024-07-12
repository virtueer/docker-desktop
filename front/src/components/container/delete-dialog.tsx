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
import { ContainerInfo } from "~types/v2/container/list";

type Props = {
  container: ContainerInfo;
  children?: JSX.Element;
};

export default function ContainerDeleteDialog({ container, children }: Props) {
  const alertDialogTitle = "Delete container?";

  const alertDialogDescription = `The '${container!.Names}' container is selected for deletion. Any anonymous volumes associated with this container are also deleted.`;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant="ghost"
            className="p-2 rounded-full h-auto hover:bg-slate-300"
          >
            <FaTrash />
          </Button>
        )}
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
