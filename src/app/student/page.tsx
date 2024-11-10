'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import { useAppSelector } from '@/hooks/redux';
import {
  studentInfoChartData,
  studentInfoSpecialization,
} from '@/redux/reducers/studentInfoReducer';
import { PieChartLabeled } from '@/components/charts/PieChartLabeled';
import { LineChart } from '@/components/charts/LineChart';

import constantNameFormatter from '@/utils/constantNameFormatter';
import ModuleResults from '@/features/modules/student/components/ModuleResults';
import { Separator } from '@/components/ui/separator';
import GradeChart from '@/components/charts/GradeChart';
// import BarChartSemester from '@/features/grade/student/components/BarChartSemester';

const Dashboard = () => {
  const studentInfoSelector = useAppSelector((s) => s.studentInfo);
  const chartData = studentInfoChartData(studentInfoSelector);
  const specialization = studentInfoSpecialization(studentInfoSelector);
  const formattedSpecialization = constantNameFormatter(specialization);
  const grade = {
    description: 'Careers based on accomplishments.',
    title: `${formattedSpecialization} career chart`,
  };

  const gradeChart = chartData.map(({ job, ...rest }) => ({
    job: constantNameFormatter(job, true),
    ...rest,
  }));

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
      <div className="flex flex-col gap-4 pt-20">
        <Hero />
        <DashboardSeparator />
        <h2 className="px-4 font-semibold">Charts:</h2>
        <div className="grid grid-flow-row gap-4 px-4 sm:grid-flow-col">
          <PieChartLabeled
            title={`${formattedSpecialization} certificate chart`}
            description={grade.description}
          />
          <GradeChart
            parentStyle="relative flex"
            selectStyle="absolute bottom-2 w-full p-2 px-4"
            title={grade.title}
            chartData={gradeChart}
            chartConfig={chartConfig}
          />
          <LineChart
            title={`${formattedSpecialization} internship chart`}
            description={grade.description}
          />
        </div>
        {/* <BarChartSemester /> */}
      </div>
      <DashboardSeparator />
      <div>
        <h2 className="px-4 font-semibold">Modules Results:</h2>
        <ModuleResults />
      </div>
    </>
  );
};

const DashboardSeparator = () => {
  return (
    <div className="p-4">
      <Separator />
    </div>
  );
};

export default Dashboard;
