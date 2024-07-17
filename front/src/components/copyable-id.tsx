import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { MdOutlineContentCopy } from "react-icons/md";

type Props = {
  id: string;
};

export default function CopyableId({ id }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: any) {
    e.preventDefault();
    navigator.clipboard.writeText(id);
    setCopied(true);
    await new Promise((r) => setTimeout(r, 2500));
    setCopied(false);
  }

  return (
    <div className="flex items-center">
      <span className="text-slate-300 text-xs cursor-auto select-text">
        {id.slice(0, 12)}
      </span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="p-2 h-fit rounded-full text-slate-400 hover:bg-night-300/25 hover:text-sky-600 active:bg-slate-400"
              onClick={handleCopy}
            >
              {!copied && <MdOutlineContentCopy size="0.75rem" />}
              {copied && <FaCheck size="0.75rem" className="text-green-500" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-600 text-slate-100" side="bottom">
            <p>{copied ? "Copied" : "Copy to clipboard"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
