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
import { EMPTY_STRING, NUMBER_OF_SEMESTER } from '@/utils/constants';
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
// import BarChartSemester from '@/features/grade/student/components/BarChartSemester';

type InitialState = {
  grade: 'bar' | 'area' | 'radar';
};

const Dashboard = () => {
  const chartData = studentInfoChartData(useAppSelector((s) => s.studentInfo));
  const description = 'Showing careers related to your performance.';
  const _grades = grades(useAppSelector((s) => s.grade));
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const [state, setState] = useState({
    grade: 'bar',
  } as InitialState);

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
            description={description}
            title="certificates"
            footerDescription={
              <ParagraphNode description={'Certificates Chart'} />
            }
          />
          <section>
            <BarChart
              render={state.grade === 'bar'}
              chartData={chartData}
              chartConfig={chartConfig}
              description={description}
              title="careers"
              footerDescription={<ParagraphNode description={'Career Chart'} />}
            />
            <AreaChart
              render={state.grade === 'area'}
              chartData={[...chartData]}
              chartConfig={chartConfig}
              description={description}
              title="careers"
              footerDescription={<ParagraphNode description={'Career Chart'} />}
            />
            <RadarChart
              render={state.grade === 'radar'}
              chartData={[...chartData]}
              chartConfig={chartConfig}
              description={description}
              title="careers"
              footerDescription={<ParagraphNode description={'Career Chart'} />}
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
            description={description}
            title="internship"
            footerDescription={
              <ParagraphNode description={'Internship Chart'} />
            }
          />
        </div>
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
