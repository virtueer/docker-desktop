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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getContainerName } from "@/table/container/helper";

type Props = {
  container: ContainerInfo;
};

export default function RemoveContainerDialog({ container }: Props) {
  return (
    <AlertDialog>
      <TooltipProvider delayDuration={500}>
        <AlertDialogTrigger>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="bg-red-600 hover:bg-red-500">
                <FaTrash />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-slate-600 text-slate-100"
            >
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </AlertDialogTrigger>
        <AlertDialogContent className="dark text-white w-fit">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove container</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to remove the container '
              {getContainerName(container.Names)}' and all its data.
              <br />
              Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-blue-500 border-2 rounded-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-500 text-white">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </TooltipProvider>
    </AlertDialog>
  );
}
