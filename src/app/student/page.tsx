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
    ...rest,
    job: constantNameFormatter(job),
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
      <div className="flex flex-col gap-4 py-12">
        <Hero />
        <div className="grid grid-cols-3">
          <PieChartLabeled
            title={`${formattedSpecialization} certificate chart`}
            description={grade.description}
          />
          <section>
            <BarChart
              render={state.grade === 'bar'}
              chartData={gradeChart}
              chartConfig={chartConfig}
              description={grade.description}
              title={grade.title}
            />
            <AreaChart
              render={state.grade === 'area'}
              chartData={gradeChart}
              chartConfig={chartConfig}
              description={grade.description}
              title={grade.title}
            />
            <RadarChart
              render={state.grade === 'radar'}
              chartData={gradeChart}
              chartConfig={chartConfig}
              description={grade.description}
              title={grade.title}
            />
            <div className="lg:1/2 mx-auto h-auto md:w-3/4">
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
                <SelectTrigger>
                  <SelectValue placeholder="Choose a chart to display breakdown for all modules." />
                </SelectTrigger>
                <SelectContent>
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
    </>
  );
};

export default Dashboard;
