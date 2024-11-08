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
import { NUMBER_OF_SEMESTER } from '@/utils/constants';
import { PieChartLabeled } from '@/components/charts/PieChartLabeled';
import { LineChart } from '@/components/charts/LineChart';
import { useState } from 'react';
import { RadarChart } from '@/components/charts/RadarChart';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';
import { grades } from '@/redux/reducers/gradeReducer';
import constantNameFormatter from '@/utils/constantNameFormatter';
import ModuleResults from '@/features/modules/student/components/ModuleResults';
import { Separator } from '@/components/ui/separator';
// import BarChartSemester from '@/features/grade/student/components/BarChartSemester';

type InitialState = {
  grade: 'bar' | 'area' | 'radar';
};

const Dashboard = () => {
  const studentInfoSelector = useAppSelector((s) => s.studentInfo);
  const chartData = studentInfoChartData(studentInfoSelector);
  const specialization = studentInfoSpecialization(studentInfoSelector);
  const formattedSpecialization = constantNameFormatter(specialization);
  const grade = {
    description: 'Careers based on accomplishments.',
    title: `${formattedSpecialization} career chart`,
  };
  const _grades = grades(useAppSelector((s) => s.grade));
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const [state, setState] = useState({
    grade: 'bar',
  } as InitialState);

  const gradeChart = chartData.map(({ job, ...rest }) => ({
    job: constantNameFormatter(job),
    ...rest,
  }));
  console.log(state);
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
          <section className="relative flex">
            <BarChart
              render={state.grade === 'bar'}
              chartData={gradeChart}
              chartConfig={chartConfig}
              description={'Career ranking based on accomplishments.'}
              title={grade.title}
            />
            <AreaChart
              render={state.grade === 'area'}
              chartData={gradeChart}
              chartConfig={chartConfig}
              description={'Career ranking based on accomplishments.'}
              title={grade.title}
            />
            <RadarChart
              render={state.grade === 'radar'}
              chartData={gradeChart}
              chartConfig={chartConfig}
              description={'Career ranking based on accomplishments.'}
              title={grade.title}
            />
            <div className="absolute bottom-2 w-full p-2 px-4">
              <Select
                disabled={
                  disabledNoUserList.includes(authStatus) ||
                  _grades.length < NUMBER_OF_SEMESTER
                }
                onValueChange={(value) =>
                  setState((prevState) => ({
                    ...prevState,
                    grade: value as InitialState['grade'],
                  }))
                }
              >
                <SelectTrigger className="capitalize">
                  <SelectValue placeholder="Choose a chart" />
                </SelectTrigger>
                <SelectContent className="capitalize">
                  {(['area', 'bar', 'radar'] as InitialState['grade'][]).map(
                    (v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </section>
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
