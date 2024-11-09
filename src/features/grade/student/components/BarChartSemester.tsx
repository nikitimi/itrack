'use client';

import BarChart from '@/components/charts/BarChart';
import { grades } from '@/redux/reducers/gradeReducer';
import { useAppSelector } from '@/hooks/redux';
import gradeLevelEnum from '@/lib/enums/gradeLevel';
import semesterEnum from '@/lib/enums/semester';

const chartConfig = {
  gwa: {
    label: 'GWA',
    color: 'hsl(var(--chart-1))',
  },
  firstYear: {
    label: 'First year',
    color: 'hsl(var(--chart-1))',
  },
  secondYear: {
    label: 'Second year',
    color: 'hsl(var(--chart-2))',
  },
  thirdYear: {
    label: 'Third year',
    color: 'hsl(var(--chart-3))',
  },
};

const BarChartSemester = () => {
  const _grades = grades(useAppSelector((s) => s.grade));
  const result = gradeLevelEnum.options
    .map((grade) => _grades.filter((s) => s.yearLevel === grade))
    .filter((s) => s.length > 0);
  const gradesFlatted = result.map((array) =>
    array.map((gradeInfo) => gradeInfo.subjects.map((s) => s.grade))
  );

  const gradesComputed = gradesFlatted.map((yrLevel) =>
    yrLevel.map((g) => {
      let points = 0;
      g.forEach((ig) => (points += parseInt(ig, 10)));
      return { points, length: g.length };
    })
  );
  const cComp = gradesComputed.map((t, index) => {
    let obj: Record<string, string | number> = {
      yearLevel: gradeLevelEnum.options[index],
    };
    t.forEach((gt, i) => {
      obj = {
        ...obj,
        [semesterEnum.options[i]]: (gt.points / gt.length).toFixed(2),
      };
    });
    return obj;
  });

  console.log(cComp);

  return (
    <BarChart
      chartConfig={chartConfig}
      chartData={[]}
      description={'These are the GWA calculated based on the COG.'}
      title={'Bar Chart - General Weighted Average'}
      footerDescription={<p>GWA Chart</p>}
    />
  );
};

export default BarChartSemester;
