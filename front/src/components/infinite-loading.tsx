import { cn } from "@/lib/utils";
import "./infinite-loading.css";

export default function InfiniteLoading({
  width,
  className,
}: {
  width: string;
  className?: string;
}) {
  return (
    <div className={cn("loader mx-auto", className)} style={{ width }}>
      <div className="loaderBar"></div>
    </div>
  );
}
