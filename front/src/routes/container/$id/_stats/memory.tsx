import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import bytes from "bytes";
import { ContainerStats } from "~types/container";

export default function MemoryStats({
  chartData,
}: {
  chartData: ContainerStats[];
}) {
  const memory_limit = chartData.reduce(
    (acc, _, i, arr) => Math.max(arr[i].memory_stats.limit, acc),
    0
  );

  const calculateMemoryUsage = (data: ContainerStats) =>
    data.memory_stats.usage - data.memory_stats.stats.cache;

  return (
    <div>
      <span>
        Memory Usage:{" "}
        {bytes(calculateMemoryUsage(chartData[chartData.length - 1]))} /{" "}
        {bytes(memory_limit)}
      </span>
      <ChartContainer config={{}} className="min-h-[100px] w-full h-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{ top: 20, bottom: 10, right: 20, left: 10 }}
        >
          <CartesianGrid vertical={false} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) =>
                  bytes(value as number, { unitSeparator: " " })
                }
                labelFormatter={(label) => new Date(label).toLocaleTimeString()}
              />
            }
          />
          <Line dataKey={calculateMemoryUsage} fill="gray" radius={4} />
          <YAxis
            type="number"
            tickMargin={10}
            domain={[0, memory_limit]}
            tickFormatter={(v) => bytes(v, { unitSeparator: " " })}
          />
          <XAxis
            dataKey="read"
            tickLine={false}
            tickMargin={30}
            axisLine={false}
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            angle={-70}
            height={60}
            interval={2}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
