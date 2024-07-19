import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ContainerStats } from "~types/container";

export default function MemoryStats({
  chartData,
}: {
  chartData: ContainerStats[];
}) {
  const calculateCPUPercentage = (data: ContainerStats) => {
    const cpu_delta =
      data.cpu_stats.cpu_usage.total_usage -
      data.precpu_stats.cpu_usage.total_usage;
    const system_cpu_delta =
      data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
    const number_cpus = data.cpu_stats.online_cpus;
    const result = (cpu_delta / system_cpu_delta) * number_cpus * 100.0;

    return result ? result.toFixed(2) : NaN;
  };

  return (
    <div>
      <span>
        CPU Usage: {calculateCPUPercentage(chartData[chartData.length - 1])}%
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
                formatter={(val) => val || "unknown"}
                labelFormatter={(label) => new Date(label).toLocaleTimeString()}
              />
            }
          />
          <Line
            dataKey={(val) => calculateCPUPercentage(val)}
            fill="gray"
            radius={4}
          />
          <YAxis
            type="number"
            tickMargin={10}
            domain={([_, dataMax]) => [0, Math.ceil(dataMax)]}
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
