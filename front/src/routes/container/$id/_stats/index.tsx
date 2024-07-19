import { useContainerStats } from "@/api/container/stats";
import MemoryStats from "./memory";
import InfiniteLoading from "@/components/infinite-loading/infinite-loading";
import CpuStats from "./cpu";

export default function StatsTab({ id }: { id: string }) {
  const { data, isLoading } = useContainerStats(id);

  if (isLoading) return <InfiniteLoading width="200px" />;

  if (!data) return "No Data";

  return (
    <div className="grid grid-cols-2 gap-5">
      <CpuStats chartData={data.stats} />
      <MemoryStats chartData={data.stats} />
    </div>
  );
}
