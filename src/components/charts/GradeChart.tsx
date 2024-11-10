import React from 'react';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';
import { EMPTY_STRING, NUMBER_OF_SEMESTER } from '@/utils/constants';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import BarChart from '@/components/charts/BarChart';
import { RadarChart } from '@/components/charts/RadarChart';
import { ChartProps } from '@/components/charts/ParentChart';
import AreaChart from '@/components/charts/AreaChart';
import { useState } from 'react';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';
import { grades } from '@/redux/reducers/gradeReducer';
import { useAppSelector } from '@/hooks/redux';

type GradeChartProps = {
  title: string | [string, string, string];
  selectStyle?: string;
  parentStyle?: string;
} & Pick<ChartProps, 'chartConfig' | 'chartData'>;

type InitialState = {
  grade: 'bar' | 'area' | 'radar';
};

const GradeChart = ({ title, ...rest }: GradeChartProps) => {
  const isTitleString = typeof title === 'string';
  const _grades = grades(useAppSelector((s) => s.grade));
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const [state, setState] = useState({
    grade: 'bar',
  } as InitialState);

  return (
    <section className={rest.parentStyle ?? EMPTY_STRING}>
      <BarChart
        {...rest}
        render={state.grade === 'bar'}
        description={'Career ranking based on accomplishments.'}
        title={isTitleString ? title : title[0]}
      />
      <AreaChart
        {...rest}
        render={state.grade === 'area'}
        description={'Career ranking based on accomplishments.'}
        title={isTitleString ? title : title[0]}
      />
      <RadarChart
        {...rest}
        render={state.grade === 'radar'}
        description={'Career ranking based on accomplishments.'}
        title={isTitleString ? title : title[0]}
      />
      <div className={rest.selectStyle ?? EMPTY_STRING}>
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
            {(['area', 'bar', 'radar'] as InitialState['grade'][]).map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
};

export default GradeChart;
