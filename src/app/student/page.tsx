'use client';

import BarChart from '@/components/charts/BarChart';
import AreaChart from '@/components/charts/AreaChart';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import { useAppSelector } from '@/hooks/redux';
import {
  studentInfoChartData,
  studentInfoSpecialization,
} from '@/redux/reducers/studentInfoReducer';
import { EMPTY_STRING } from '@/utils/constants';
import { PieChartLabeled } from '@/components/charts/PieChartLabeled';
import { LineChart } from '@/components/charts/LineChart';
// import BarChartSemester from '@/features/grade/student/components/BarChartSemester';

const Dashboard = () => {
  const chartData = studentInfoChartData(useAppSelector((s) => s.studentInfo));
  const description = 'Showing careers related to your performance.';

  const chartConfig = {
    certificate: {
      label: 'Certificate',
      color: 'hsl(var(--chart-1))',
    },
    grades: {
      label: 'Grades',
      color: 'hsl(var(--chart-2))',
    },
    internship: {
      label: 'Internship',
      color: 'hsl(var(--chart-3))',
    },
  };

  return (
    <>
      <Header />
      <div className="flex flex-col gap-4 py-12">
        <Hero />
        <BarChart
          chartData={chartData}
          chartConfig={chartConfig}
          description={description}
          title="careers"
          footerDescription={<ParagraphNode description={'Career Chart'} />}
        />
        <AreaChart
          chartData={[...chartData]}
          chartConfig={chartConfig}
          description={description}
          title="careers"
          footerDescription={<ParagraphNode description={'Career Chart'} />}
        />
        <PieChartLabeled
          description={description}
          title="certificates"
          footerDescription={
            <ParagraphNode description={'Certificates Chart'} />
          }
        />
        <LineChart
          description={description}
          title="internship"
          footerDescription={<ParagraphNode description={'Internship Chart'} />}
        />
        {/* <BarChartSemester /> */}
      </div>
    </>
  );
};

const ParagraphNode = ({ description }: { description: string }) => {
  const specialization = studentInfoSpecialization(
    useAppSelector((s) => s.studentInfo)
  );

  return (
    <p className="flex gap-1 capitalize">
      {(specialization ?? EMPTY_STRING).replace(/_/g, ' ').toLocaleLowerCase()}
      <span>{description}</span>
    </p>
  );
};

export default Dashboard;
