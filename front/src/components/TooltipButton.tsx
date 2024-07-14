import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import * as React from "react";

type Props = {
  side?: React.ComponentProps<typeof TooltipContent>["side"];
  delayDuration?: React.ComponentProps<typeof Tooltip>["delayDuration"];
  arrowWidth?: React.ComponentProps<typeof TooltipArrow>["width"];
  arrowHeight?: React.ComponentProps<typeof TooltipArrow>["height"];
  open?: React.ComponentProps<typeof Tooltip>["open"];
  onOpenChange?: React.ComponentProps<typeof Tooltip>["onOpenChange"];
  tooltipText: string;
} & React.ComponentProps<typeof Button>;

const TooltipButton = React.forwardRef<React.ElementRef<typeof Button>, Props>(
  (
    {
      className,
      asChild = false,
      side = "top",
      delayDuration = 500,
      tooltipText = "text",
      children,
      arrowWidth = 12.5,
      arrowHeight = 7.5,
      open,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    return (
      <TooltipProvider>
        <Tooltip
          delayDuration={delayDuration}
          onOpenChange={onOpenChange}
          open={open}
        >
          <TooltipTrigger asChild>
            <Button
              className={cn(
                "p-2 rounded-full h-auto hover:bg-slate-600 hover:text-blue-500",
                className
              )}
              style={{ boxShadow: "none", outline: "none" }}
              {...props}
              ref={ref}
            >
              {children}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side} className="bg-slate-500 text-white">
            <p>{tooltipText}</p>
            <TooltipArrow
              fill="#64748b"
              width={arrowWidth}
              height={arrowHeight}
            />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

TooltipButton.displayName = "TooltipButton";

export { TooltipButton };
