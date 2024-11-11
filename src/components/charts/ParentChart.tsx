'use client';

import type { Children } from '@/utils/types/children';
import type { ChartConfig } from '@/components/ui/chart';

import { TrendingUp } from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

type ParentChartProps = Children & {
  description: string;
  title: string;
  footerDescription?: React.ReactNode;
  render?: boolean;
};

export type ChartProps = {
  chartConfig: ChartConfig;
  chartData: Record<string, string | number>[];
} & Omit<ParentChartProps, 'children'>;

export const chartDataColor = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const ParentChart = ({ children, ...rest }: ParentChartProps) => {
  return (
    <Card className={`${rest.render === false ? 'hidden' : ''} mx-auto`}>
      <CardHeader>
        <CardTitle className="flex gap-2 capitalize">
          {rest.title}
          <TrendingUp className="h-4 w-4" />
        </CardTitle>
        <CardDescription>{rest.description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default ParentChart;
