'use client';

import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart as LChart,
  XAxis,
} from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
// eslint-disable-next-line boundaries/element-types
import internshipResult from '@/features/internship/utils/internshipResult';
import { studentInfoSpecialization } from '@/redux/reducers/studentInfoReducer';
import { useAppSelector } from '@/hooks/redux';
import {
  internshipCompanyQuestion,
  internshipGrade,
  internshipTasks,
} from '@/redux/reducers/internshipReducer';
import ParentChart, { chartDataColor, ChartProps } from './ParentChart';
import { internshipModuleInputControl } from '@/redux/reducers/inputControlReducer';
import disabledWriteInDB from '@/utils/disabledWriteInDB';
import chartTickFormatter from '@/utils/chartTickFormatter';

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'hsl(var(--chart-2))',
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
} satisfies ChartConfig;

/** Used for internship result. */
export function LineChart(
  props: Omit<ChartProps, 'chartData' | 'chartConfig'>
) {
  const internshipSelector = useAppSelector((s) => s.internship);
  const specialization = studentInfoSpecialization(
    useAppSelector((s) => s.studentInfo)
  );
  const inputControl = internshipModuleInputControl(
    useAppSelector((s) => s.inputControl)
  );

  if (!disabledWriteInDB.includes(inputControl)) return <></>;

  const tasks = internshipTasks(internshipSelector);
  const isITCompany = internshipCompanyQuestion(internshipSelector);
  const grade = internshipGrade(internshipSelector);
  const result = internshipResult({
    internshipResult: {
      tasks,
      isITCompany: isITCompany as boolean,
      grade,
    },
    specialization,
  });
  const chartData = result.taskPerformedCalculations.map((obj, index) => {
    const parsed = Object.entries(obj)[0];

    return {
      career: parsed[0],
      percentage: parsed[1],
      fill: chartDataColor[index],
    };
  });

  let totalPoints = 0;
  chartData.flatMap((s) => s.percentage).forEach((p) => (totalPoints += p));

  console.log({
    tasks,
    isITCompany,
    grade,
    result,
  });

  return (
    <ParentChart {...props}>
      <ChartContainer config={chartConfig}>
        <LChart
          accessibilityLayer
          data={chartData.map((d) => ({
            ...d,
            percentage: `${Math.round((d.percentage / totalPoints) * 100).toFixed(2)}`,
          }))}
          margin={{
            top: 24,
            left: 24,
            right: 24,
          }}
        >
          <CartesianGrid vertical={true} />
          <XAxis
            dataKey="career"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={chartTickFormatter}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                nameKey="percentage"
                hideLabel
              />
            }
          />
          <Line
            dataKey="percentage"
            type="natural"
            stroke="var(--color-visitors)"
            strokeWidth={2}
            dot={{
              fill: 'var(--color-visitors)',
            }}
            activeDot={{
              r: 6,
            }}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
              dataKey="career"
              formatter={(value: keyof typeof chartConfig) =>
                chartConfig[value]?.label
              }
            />
          </Line>
        </LChart>
      </ChartContainer>
    </ParentChart>
  );
}
