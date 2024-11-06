'use client';

import {
  AreaChart as ArChart,
  CartesianGrid,
  XAxis,
  Area,
  YAxis,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import ParentChart, { type ChartProps } from '@/components/charts/ParentChart';
import useChartDataKeys from '@/hooks/useChartDataKeys';
import chartTickFormatter from '@/utils/chartTickFormatter';

export default function AreaChart(props: ChartProps) {
  const { chartConfig, chartData, ...rest } = props;
  const chartKeys = useChartDataKeys(chartData);

  return (
    <ParentChart {...rest}>
      <ChartContainer config={chartConfig}>
        <ArChart
          accessibilityLayer
          className="capitalize"
          data={chartData}
          margin={{
            left: -20,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={chartKeys?.[0]}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={chartTickFormatter}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickCount={3}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          {chartKeys?.splice(1).map((key) => {
            const colorVariable = `var(--color-${key})`;

            return (
              <Area
                key={key}
                dataKey={key}
                fill={colorVariable}
                type="natural"
                fillOpacity={0.4}
                stroke={colorVariable}
                stackId="a"
              />
            );
          })}
        </ArChart>
      </ChartContainer>
    </ParentChart>
  );
}
