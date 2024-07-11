import { Button } from "@/components/ui/button";
import { getColorByState } from "@/table/container/helper";
import { Link } from "@tanstack/react-router";
import { GoContainer } from "react-icons/go";
import { MdOutlineContentCopy } from "react-icons/md";
import { ContainerInfo } from "~types/v2/container/list";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaCheck } from "react-icons/fa6";
import { useState } from "react";

export function ContainerIcon({
  container,
  depth,
}: {
  container: ContainerInfo;
  depth: number;
}) {
  const [copied, setCopied] = useState(false);
  const color = getColorByState(container.State);
  const paddingLeft = `${depth}rem`;

  async function handleCopy(e: any) {
    e.preventDefault();
    navigator.clipboard.writeText(container.Id);
    setCopied(true);
    await new Promise((r) => setTimeout(r, 2500));
    setCopied(false);
  }

  return (
    <Link
      to={"/v2/container/$id"}
      params={{ id: container.Id }}
      className="drag-none text-blue-500 font-bold"
    >
      <div className="flex items-center gap-3">
        <div style={{ paddingLeft }}>
          {<GoContainer size="1.5rem" color={color} />}
        </div>
        <div className="flex flex-col">
          <span className="underline underline-offset-2">
            {container.Names.map((x) => (x[0] === "/" ? x.slice(1) : x))}
          </span>
          <div className="flex items-center">
            <span className="text-slate-300 text-xs cursor-auto select-text">
              {container.Id.slice(0, 12)}
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
                    {copied && (
                      <FaCheck size="0.75rem" className="text-green-500" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-slate-600 text-slate-100"
                  side="bottom"
                >
                  <p>{copied ? "Copied" : "Copy to clipboard"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </Link>
  );
}
