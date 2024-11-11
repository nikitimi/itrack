'use client';

import type { GradeInfo } from '@/lib/schema/gradeInfo';
import type { MongoExtra } from '@/lib/schema/mongoExtra';

import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import specializationEnum, { Specialization } from '@/lib/enums/specialization';
import { useAppDispatch } from '@/hooks/redux';
import { gradesAdd } from '@/redux/reducers/gradeReducer';
import {
  internshipCompanyQuestionUpdate,
  internshipGradeUpdate,
  internshipTaskAdd,
} from '@/redux/reducers/internshipReducer';
import { inputControlSetPromptType } from '@/redux/reducers/inputControlReducer';
import { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import { authenticationSetStatus } from '@/redux/reducers/authenticationReducer';
import { InitializeApp } from '@/lib/schema/initializeApp';
import fetchHelper from '@/utils/fetch';
import { StudentInfo } from '@/lib/schema/studentInfo';
import { EMPTY_STRING } from '@/utils/constants';
import constantNameFormatter from '@/utils/constantNameFormatter';
import gradeLevelEnum from '@/lib/enums/gradeLevel';
import semesterEnum from '@/lib/enums/semester';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import AreaChart from '@/components/charts/AreaChart';
import { ChartConfig } from '@/components/ui/chart';
import { AdminLineChart } from '@/components/charts/AdminLineChart';
import { Separator } from '@/components/ui/separator';
import BarChart from '@/components/charts/BarChart';

type FetchedData = {
  grades: Record<string, Omit<GradeInfo & MongoExtra, 'studentNumber'>[]>[];
  filteredStudentInfo: StudentInfo[];
};

type InitialState = {
  specializationSelected: Specialization | null;
  studentNumber: string | null;
  internshipData: Record<string, Required<InitializeApp['internship']>[]>[];
  studentData: StudentInfo[];
} & FetchedData;
type AdminChart = {
  web: number;
  business: number;
  service: number;
  students: number;
};

const initialState: InitialState = {
  grades: [],
  studentData: [],
  internshipData: [],
  specializationSelected: null,
  studentNumber: null,
  filteredStudentInfo: [],
};

const Admin = () => {
  const [state, setState] = useState(initialState);
  const cardRef = useRef<HTMLDivElement>(null);
  // const _grades = grades(useAppSelector((s) => s.grade));
  const dispatch = useAppDispatch();
  const triggerClasses =
    'rounded-lg bg-black/90 px-4 py-2 capitalize text-white shadow-sm';
  const specializations = specializationEnum.options.map((s) =>
    constantNameFormatter(s, true)
  );

  const chartConfig = {
    date: {
      label: 'Date',
      color: '--foreground',
    },
    business: {
      label: specializations[0],
      color: 'hsl(var(--chart-2))',
    },
    web: {
      label: specializations[1],
      color: 'hsl(var(--chart-3))',
    },
    service: {
      label: specializations[2],
      color: 'hsl(var(--chart-4))',
    },
    students: {
      label: 'Overall',
      color: 'hsl(var(--chart-5))',
    },
  } satisfies ChartConfig;

  function getStudentInfoByDate() {
    let adminLineChartHolder: AdminChart[] = [];
    const studentInfoFormattedDate = state.filteredStudentInfo.map(
      ({
        firstName,
        lastName,
        middleInitial,
        specialization,
        studentNumber,
        userId,
        ...rest
      }) => {
        const date = new Date();
        date.setTime(rest.createdAt ?? 0);

        return {
          firstName,
          lastName,
          middleInitial,
          specialization,
          studentNumber,
          userId,
          date: date.toDateString(),
        };
      }
    );
    const dateStringifiedList = Array.from(
      new Set(studentInfoFormattedDate.map(({ date }) => date))
    );

    const filteredByDate = dateStringifiedList.map((date) => ({
      date,
      studentInfo: studentInfoFormattedDate
        .filter((s) => s.date === date)
        .map(({ date, ...rest }) => {
          console.log(date);
          return { ...rest };
        }),
    }));

    const chartData = filteredByDate.map((r) => ({
      date: r.date,
      students: r.studentInfo.length,
      web: r.studentInfo.filter(
        (s) => s.specialization === 'WEB_AND_MOBILE_DEVELOPMENT'
      ).length,
      business: r.studentInfo.filter(
        (s) => s.specialization === 'BUSINESS_ANALYTICS'
      ).length,
      service: r.studentInfo.filter(
        (s) => s.specialization === 'SERVICE_MANAGEMENT_PROGRAM'
      ).length,
    }));

    if (chartData[0] !== undefined) {
      const calculatedAdminLineChart = Object.keys(chartData[0]).map((k) => ({
        [k]: chartData
          .map((record) => record[k as keyof typeof record] as number)
          .reduce((a, b) => a + b),
      }));

      adminLineChartHolder = calculatedAdminLineChart
        .reduce((acc: AdminChart[], curr: { [key: string]: number }) => {
          const { date, ...rest } = curr;
          console.log(date, 'adminLine');
          return [...acc, rest as AdminChart];
        }, [])
        .filter((s) => Object.keys(s).length > 0);
    }
    return { adminLineChartHolder, chartData };
  }
  const { adminLineChartHolder, chartData } = getStudentInfoByDate();

  useEffect(() => {
    function setSubject() {
      if (state.studentNumber === null) return;

      const filteredGradesData = state.grades
        ?.filter((object) =>
          Object.keys(object).includes(state.studentNumber as string)
        )
        .map((object) => Object.entries(object).map(([, v]) => v))[0];
      filteredGradesData?.forEach((gradeInfo) =>
        gradeInfo.forEach(({ academicYear, semester, yearLevel, subjects }) =>
          dispatch(
            gradesAdd({
              studentNumber: state.studentNumber as string,
              academicYear,
              semester,
              yearLevel,
              subjects,
            })
          )
        )
      );
      dispatch(
        inputControlSetPromptType({
          key: 'internshipModule',
          promptType: 'fetched from server',
        })
      );
    }
    function setInternship() {
      if (state.studentNumber === null) return;
      const filteredInternshipData = state.internshipData
        ?.filter((object) =>
          Object.keys(object).includes(state.studentNumber as string)
        )
        .map((object) => Object.entries(object).map(([, v]) => v))[0];
      filteredInternshipData?.forEach((internshipInfo) => {
        internshipInfo.forEach((props) => {
          if (props === undefined) return;

          const { grade, isITCompany, tasks } = props;
          dispatch(internshipGradeUpdate(grade));
          dispatch(internshipCompanyQuestionUpdate(isITCompany));
          tasks.forEach((task) => dispatch(internshipTaskAdd(task)));
        });
      });
      dispatch(
        inputControlSetPromptType({
          key: 'internshipModule',
          promptType: 'fetched from server',
        })
      );
    }

    setInternship();
    setSubject();
    return () => {
      dispatch(authenticationSetStatus('authenticated'));
    };
  }, [dispatch, state.studentNumber, state.grades, state.internshipData]);

  useEffect(() => {
    async function initializeStudentInformation() {
      /** Clerk public metadata cannot be acccessed inside functions. Maybe must be root level. */
      const response = await fetchHelper({
        route: '/api/mongo/grades',
        method: 'GET',
        params: {
          role: 'admin',
        },
      });
      const { data, errorMessage } =
        (await response.json()) as BaseAPIResponse<{
          grades: InitialState['grades'];
          filteredStudentInfo: StudentInfo[];
        }>;

      if (!response.ok) return alert(`Grades: ${errorMessage[0]}`);

      setState((prevState) => ({
        ...prevState,
        grades: data.grades,
        filteredStudentInfo: data.filteredStudentInfo,
      }));
    }
    return void initializeStudentInformation();
  }, [dispatch]);

  return (
    <>
      <Header />
      <Card className="mt-12 rounded-none border-none shadow-none">
        <CardHeader>
          <CardTitle>Charts</CardTitle>
          <CardDescription>
            All-time number of students registered:
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-flow-row gap-4">
          <AdminLineChart
            chartData={chartData}
            chartConfig={chartConfig}
            memoValue={adminLineChartHolder}
            title={'Students number Chart'}
            description={`The total number of ITrack-registered students are ${chartData.reduce((acc, curr) => acc + curr.students, 0)}`}
          />
          <Separator />
          <section className="grid grid-flow-row justify-between sm:grid-flow-col">
            <AreaChart
              chartConfig={chartConfig}
              chartData={chartData.reduce(
                (acc, curr) => {
                  const { students, ...rest } = curr;
                  console.log(students);
                  return [...acc, rest];
                },
                [] as Record<string, string | number>[]
              )}
              title={'Specialization Chart'}
              description={'Get the number of students by specialization.'}
            />
            <BarChart
              chartConfig={chartConfig}
              chartData={chartData.reduce(
                (acc, curr) => {
                  const { students, ...rest } = curr;
                  console.log(students);
                  return [...acc, rest];
                },
                [] as Record<string, string | number>[]
              )}
              title={'Specialization Chart'}
              description={'Get the number of students by specialization.'}
            />
            <BarChart
              chartConfig={chartConfig}
              chartData={chartData.reduce(
                (acc, curr) => {
                  const { students, ...rest } = curr;
                  console.log(students);
                  return [...acc, rest];
                },
                [] as Record<string, string | number>[]
              )}
              title={'Specialization Chart'}
              description={'Get the number of students by specialization.'}
            />
          </section>
        </CardContent>
      </Card>
      <div className="px-6">
        <Separator />
      </div>
      <Card className="rounded-none border-none shadow-none">
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>All the student infos resides here.</CardDescription>
          <section>
            <Label htmlFor="filters">Filter by:</Label>
            <div id="filters" className="flex justify-between gap-2">
              <Select
                onValueChange={(s) =>
                  setState((prevState) => ({
                    ...prevState,
                    specializationSelected: s as Specialization,
                  }))
                }
              >
                <SelectTrigger className="capitalize">
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializationEnum.options.map((v) => (
                    <SelectItem key={v} className="capitalize" value={v}>
                      {constantNameFormatter(v)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>
        </CardHeader>
        <CardContent
          className="grid h-64 gap-4 overflow-y-auto bg-slate-100 py-4"
          ref={cardRef}
        >
          {state.grades.map((object) =>
            Object.entries(object)
              .filter(([studentNumber]) =>
                // Filter by student's specialization, by default shows all students.
                state.specializationSelected === null
                  ? true
                  : state.filteredStudentInfo
                      .filter(
                        (s) => s.specialization === state.specializationSelected
                      )
                      .flatMap((s) => s.studentNumber)
                      .includes(studentNumber)
              )
              .map(([studentNumber, array]) => {
                const studentInfo = state.filteredStudentInfo?.filter(
                  (s) => s.studentNumber === studentNumber
                )[0];
                const fullName = `${studentInfo.lastName.toLocaleUpperCase()}, ${studentInfo?.firstName} ${(studentInfo.middleInitial ?? EMPTY_STRING).replace(/./g, EMPTY_STRING).toLocaleUpperCase()}`;
                const isNoGradeRecord = array.length === 0;
                return (
                  <div key={studentNumber}>
                    <Dialog>
                      <DialogHeader>
                        <DialogTrigger>
                          <DialogTitle className={triggerClasses}>
                            {fullName}
                          </DialogTitle>
                        </DialogTrigger>
                      </DialogHeader>
                      <DialogContent>
                        <Card className="border-none shadow-none">
                          <CardHeader>
                            <div className="flex justify-between">
                              <p className="font-semibold capitalize">
                                {fullName}
                              </p>
                              <p className="font-semibold">{studentNumber}</p>
                            </div>
                            <p className="capitalize">{`Specialization: ${constantNameFormatter(studentInfo.specialization)}`}</p>
                          </CardHeader>
                          <CardContent
                            className={`${isNoGradeRecord ? 'max-h-64' : 'h-64'} flex flex-col overflow-y-auto`}
                          >
                            {isNoGradeRecord ? (
                              <p>No grade records found.</p>
                            ) : (
                              array
                                .sort(
                                  (a, b) =>
                                    semesterEnum.options.indexOf(a.semester) -
                                    semesterEnum.options.indexOf(b.semester)
                                )
                                .sort(
                                  (a, b) =>
                                    gradeLevelEnum.options.indexOf(
                                      a.yearLevel
                                    ) -
                                    gradeLevelEnum.options.indexOf(b.yearLevel)
                                )
                                .map(
                                  ({ _id, semester, yearLevel, subjects }) => (
                                    <Collapsible key={_id}>
                                      <CollapsibleTrigger className="w-full">
                                        <p className={triggerClasses}>
                                          {constantNameFormatter(
                                            `${yearLevel} - ${semester}`
                                          )}
                                        </p>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <div className="bg-slate-50">
                                          {subjects.map(({ code, grade }) => (
                                            <div
                                              key={code}
                                              className="flex w-full items-center justify-between odd:bg-slate-100"
                                            >
                                              <p>{code.replace(/_/g, ' ')}</p>
                                              <p>{grade}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  )
                                )
                            )}
                          </CardContent>
                        </Card>
                      </DialogContent>
                    </Dialog>
                  </div>
                );
              })
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Admin;
