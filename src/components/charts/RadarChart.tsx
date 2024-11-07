'use client';

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RaChart,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import ParentChart, { ChartProps } from './ParentChart';
import useChartDataKeys from '@/hooks/useChartDataKeys';
import chartTickFormatter from '@/utils/chartTickFormatter';

export function RadarChart(props: ChartProps) {
  const { chartConfig, chartData, ...rest } = props;
  const chartKeys = useChartDataKeys(chartData);

  return (
    <ParentChart {...rest}>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <RaChart data={chartData}>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <PolarAngleAxis
            dataKey={chartKeys?.[0]}
            tickFormatter={chartTickFormatter}
          />
          <PolarGrid radialLines={false} />
          {chartKeys?.splice(1).map((key) => {
            const colorVariable = `var(--color-${key})`;

            return (
              <Radar
                key={key}
                dataKey={key}
                fill={colorVariable}
                fillOpacity={0}
                stroke={colorVariable}
                strokeWidth={2}
              />
            );
          })}
        </RaChart>
      </ChartContainer>
    </ParentChart>
  );
}
