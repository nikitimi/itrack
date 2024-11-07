'use client';

import { Pie, PieChart } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import ParentChart, { chartDataColor, type ChartProps } from './ParentChart';
// eslint-disable-next-line boundaries/element-types
import certificateResult from '@/features/certificate/student/utils/certificateResult';
import { certificateList } from '@/redux/reducers/certificateReducer';
import { useAppSelector } from '@/hooks/redux';
import { studentInfoSpecialization } from '@/redux/reducers/studentInfoReducer';
import constantNameFormatter from '@/utils/constantNameFormatter';

const chartConfig = {
  points: {
    label: 'Points',
  },
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--chart-1))',
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--chart-2))',
  },
  firefox: {
    label: 'Firefox',
    color: 'hsl(var(--chart-3))',
  },
  edge: {
    label: 'Edge',
    color: 'hsl(var(--chart-4))',
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))',
  },
};

/** Currently used for Certificate of the student. */
export function PieChartLabeled(
  props: Omit<ChartProps, 'chartData' | 'chartConfig'>
) {
  const _certificateList = certificateList(
    useAppSelector((s) => s.certificate)
  );
  const specialization = studentInfoSpecialization(
    useAppSelector((s) => s.studentInfo)
  );
  const certificateComputationResult = certificateResult({
    certificateList: _certificateList,
    specialization,
  }) as Record<string, number>;

  const chartData = Object.entries(certificateComputationResult).map(
    ([jobName, points], index) => ({
      career: jobName,
      points,
      fill: chartDataColor[index],
    })
  );

  return (
    <ParentChart {...props}>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px] px-0 capitalize"
      >
        <PieChart>
          <ChartTooltip
            content={<ChartTooltipContent nameKey="career" hideLabel />}
          />
          <Pie
            data={chartData.map(({ career, ...rest }) => ({
              ...rest,
              career: constantNameFormatter(career),
            }))}
            dataKey="points"
            labelLine={false}
            label={({ payload, ...props }) => {
              return (
                <text
                  cx={props.cx}
                  cy={props.cy}
                  x={props.x}
                  y={props.y}
                  textAnchor={props.textAnchor}
                  dominantBaseline={props.dominantBaseline}
                  fill="hsla(var(--foreground))"
                >
                  {payload.points}
                </text>
              );
            }}
            nameKey="career"
          />
        </PieChart>
      </ChartContainer>
    </ParentChart>
  );
}
