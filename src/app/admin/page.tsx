'use client';

import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import GradeInfo from '@/utils/types/gradeInfo';
import type { MongoExtra } from '@/lib/schema/mongoExtra';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import specializationEnum, { Specialization } from '@/lib/enums/specialization';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { grades, gradesAdd } from '@/redux/reducers/gradeReducer';
import gradeResult from '@/features/grade/student/utils/gradeResult';
import BarChart from '@/components/charts/BarChart';
import {
  internshipCompanyQuestionUpdate,
  internshipGradeUpdate,
  internshipTaskAdd,
} from '@/redux/reducers/internshipReducer';
import { inputControlSetPromptType } from '@/redux/reducers/inputControlReducer';
import { LineChart } from '@/components/charts/LineChart';

type InitialState = {
  grades: Record<string, Omit<GradeInfo & MongoExtra, 'studentNumber'>[]>[];
  specializationSelected: Specialization | null;
  studentNumber: string | null;
};

// type StudentInformation = {
//   firstName: string;
//   lastName: string;
//   role: UserRole;
//   studentType: StudentType;
//   studentNumber: string;
//   specialization: Specialization;
// };

const gradesData = [
  {
    '2021201282': [
      {
        _id: '672b033232ee880107f90393',
        semester: 'FIRST_SEMESTER',
        academicYear: '2021-2022',
        yearLevel: 'FIRST_YEAR',
        subjects: [
          {
            grade: '1.25',
            code: 'IT_102',
          },
          {
            grade: '1.50',
            code: 'IT_103',
          },
          {
            grade: '1.25',
            code: 'IT_104',
          },
          {
            grade: '1.25',
            code: 'RPH_101',
          },
          {
            grade: '1.50',
            code: 'AAP_101',
          },
          {
            grade: '1.75',
            code: 'STS_101',
          },
          {
            grade: '1.00',
            code: 'ARP_101',
          },
          {
            grade: '1.25',
            code: 'PE_10',
          },
          {
            grade: '1.25',
            code: 'NSTP_10',
          },
        ],
        dateCreated: 1730872114240,
        dateModified: -1,
      },
      {
        _id: '672b033332ee880107f90394',
        semester: 'SECOND_SEMESTER',
        academicYear: '2021-2022',
        yearLevel: 'FIRST_YEAR',
        subjects: [
          {
            grade: '1.75',
            code: 'IT_105',
          },
          {
            grade: '1.50',
            code: 'IT_106',
          },
          {
            grade: '1.50',
            code: 'IT_107',
          },
          {
            grade: '1.00',
            code: 'PCM_101',
          },
          {
            grade: '1.00',
            code: 'MMW_101',
          },
          {
            grade: '1.50',
            code: 'UTS_101',
          },
          {
            grade: '1.25',
            code: 'PAL_101',
          },
          {
            grade: '1.00',
            code: 'PE_11',
          },
          {
            grade: '1.00',
            code: 'NSTP_11',
          },
        ],
        dateCreated: 1730872115305,
        dateModified: -1,
      },
      {
        _id: '672b033732ee880107f90395',
        semester: 'FIRST_SEMESTER',
        academicYear: '2022-2023',
        yearLevel: 'SECOND_YEAR',
        subjects: [
          {
            grade: '1.75',
            code: 'IT_201',
          },
          {
            grade: '1.75',
            code: 'IT_202',
          },
          {
            grade: '2.25',
            code: 'IT_203',
          },
          {
            grade: '2.25',
            code: 'IT_204',
          },
          {
            grade: '1.75',
            code: 'IT_205',
          },
          {
            grade: '1.75',
            code: 'AAH_101',
          },
          {
            grade: '1.00',
            code: 'ETH_101',
          },
          {
            grade: '1.25',
            code: 'PE_12',
          },
        ],
        dateCreated: 1730872119253,
        dateModified: -1,
      },
      {
        _id: '672b034632ee880107f90396',
        semester: 'SECOND_SEMESTER',
        academicYear: '2022-2023',
        yearLevel: 'SECOND_YEAR',
        subjects: [
          {
            grade: '1.50',
            code: 'IT_206',
          },
          {
            grade: '1.75',
            code: 'IT_207',
          },
          {
            grade: '1.25',
            code: 'IT_208',
          },
          {
            grade: '1.00',
            code: 'IT_209',
          },
          {
            grade: '1.50',
            code: 'IT_210',
          },
          {
            grade: '1.00',
            code: 'TCW_101',
          },
          {
            grade: '1.75',
            code: 'MST_101',
          },
          {
            grade: '1.25',
            code: 'PE13',
          },
        ],
        dateCreated: 1730872134769,
        dateModified: -1,
      },
      {
        _id: '672b034b32ee880107f90397',
        semester: 'FIRST_SEMESTER',
        academicYear: '2023-2024',
        yearLevel: 'THIRD_YEAR',
        subjects: [
          {
            grade: '1.50',
            code: 'IT_301',
          },
          {
            grade: '1.50',
            code: 'IT_302',
          },
          {
            grade: '1.50',
            code: 'IT_303',
          },
          {
            grade: '3.00',
            code: 'IT_304',
          },
          {
            grade: '1.00',
            code: 'IT_305',
          },
          {
            grade: '1.50',
            code: 'IT_306',
          },
          {
            grade: '1.50',
            code: 'IT_307',
          },
          {
            grade: '1.00',
            code: 'FL301',
          },
        ],
        dateCreated: 1730872139320,
        dateModified: -1,
      },
      {
        _id: '672b035032ee880107f90398',
        semester: 'SECOND_SEMESTER',
        academicYear: '2023-2024',
        yearLevel: 'THIRD_YEAR',
        subjects: [
          {
            grade: '2.00',
            code: 'IT_308',
          },
          {
            grade: '1.50',
            code: 'IT_309',
          },
          {
            grade: '1.50',
            code: 'IT_310',
          },
          {
            grade: '1.50',
            code: 'CAP_301',
          },
          {
            grade: '1.50',
            code: 'IT_311',
          },
          {
            grade: '2.25',
            code: 'IT_312',
          },
          {
            grade: '1.00',
            code: 'FL302',
          },
          {
            grade: '1.25',
            code: 'RLW_101',
          },
        ],
        dateCreated: 1730872144950,
        dateModified: -1,
      },
    ],
  },
] as InitialState['grades'];
const studentData = [
  {
    firstName: ' jhay mark',
    lastName: 'reyes',
    role: 'student',
    studentType: 'regular',
    studentNumber: '2020200534',
    specialization: 'WEB_AND_MOBILE_DEVELOPMENT',
  },
  {
    firstName: ' ralph john',
    lastName: 'juliano',
    role: 'student',
    studentType: 'regular',
    studentNumber: '2021201472',
    specialization: 'WEB_AND_MOBILE_DEVELOPMENT',
  },
  {
    firstName: 'gisn carlo',
    lastName: 'carranza',
    role: 'student',
    studentType: 'irregular',
    studentNumber: '2021201282',
    specialization: 'SERVICE_MANAGEMENT_PROGRAM',
  },
] as const;

const initialState: InitialState = {
  grades: gradesData,
  specializationSelected: null,
  studentNumber: null,
};

const internshipData = [
  {
    '2017949494': [
      {
        _id: '672a434a6f8e82836a4f75f8',
        tasks: ['COST-BENEFIT_ANALYSIS', 'REQUIREMENT_GATHERING'],
        isITCompany: true,
        grade: '2.00',
        dateCreated: 1730822986023,
        dateModified: -1,
      },
      {
        _id: '672ac4ae1fec4e6983a3debc',
        tasks: ['DATA_ANALYSIS'],
        isITCompany: true,
        grade: '1.75',
        dateCreated: 1730856110170,
        dateModified: -1,
      },
    ],
  },
  {
    '2021201282': [
      {
        _id: '672a434a6f8e82836a4f75f8',
        tasks: ['COST-BENEFIT_ANALYSIS', 'REQUIREMENT_GATHERING'],
        isITCompany: true,
        grade: '2.00',
        dateCreated: 1730822986023,
        dateModified: -1,
      },
      {
        _id: '672ac4ae1fec4e6983a3debc',
        tasks: ['DATA_ANALYSIS'],
        isITCompany: true,
        grade: '1.75',
        dateCreated: 1730856110170,
        dateModified: -1,
      },
    ],
  },
] as const;

const Admin = () => {
  const [state, setState] = useState(initialState);
  const cardRef = useRef<HTMLDivElement>(null);
  const _grades = grades(useAppSelector((s) => s.grade));
  const dispatch = useAppDispatch();

  const studentDataGroupedBySpecialization = specializationEnum.options.map(
    (specialization) => ({
      [specialization]: studentData
        .filter((s) => s.specialization === specialization)
        .map(({ firstName, lastName, studentNumber }) => ({
          firstName,
          lastName,
          studentNumber,
        })),
    })
  );

  useEffect(() => {
    function setSubject() {
      if (state.studentNumber === null) return;
      const filteredGradesData = gradesData
        .filter((object) =>
          Object.keys(object).includes(state.studentNumber as string)
        )
        .map((object) => Object.entries(object).map(([, v]) => v))[0];
      filteredGradesData.forEach((gradeInfo) =>
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
      const filteredInternshipData = internshipData
        .filter((object) =>
          Object.keys(object).includes(state.studentNumber as string)
        )
        .map((object) => Object.entries(object).map(([, v]) => v))[0];
      filteredInternshipData.forEach((internshipInfo) =>
        internshipInfo.forEach(({ grade, isITCompany, tasks }) => {
          dispatch(internshipGradeUpdate(grade));
          dispatch(internshipCompanyQuestionUpdate(isITCompany));
          tasks.forEach((task) => dispatch(internshipTaskAdd(task)));
        })
      );
      dispatch(
        inputControlSetPromptType({
          key: 'internshipModule',
          promptType: 'fetched from server',
        })
      );
    }
    setInternship();
    setSubject();
    return () => {};
  }, [dispatch, state.studentNumber]);

  return (
    <>
      <Header />
      <Button
        disabled={true}
        onClick={async () => {
          const response = await fetch('/api/mongo/grades?role=admin', {
            method: 'GET',
          });

          const { data, errorMessage } =
            (await response.json()) as BaseAPIResponse<InitialState['grades']>;

          if (!response.ok) return alert(errorMessage[0]);

          setState((prevState) => ({ ...prevState, grades: data }));
        }}
      >
        Request Grades
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Specializations</CardTitle>
          <CardDescription>Students sorted by specializations.</CardDescription>
        </CardHeader>
        <CardContent className="grid min-h-64 grid-flow-col" ref={cardRef}>
          {studentDataGroupedBySpecialization.map((object) =>
            Object.entries(object).map(([specialization, array]) => (
              <Collapsible
                key={specialization}
                open={state.specializationSelected === specialization}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-full w-full rounded-none capitalize"
                    onClick={() => {
                      setState((prevState) => ({
                        ...prevState,
                        specializationSelected:
                          specialization as Specialization,
                        studentNumber: null,
                      }));
                    }}
                  >
                    {specialization.replace(/_/g, ' ').toLocaleLowerCase()}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="absolute inset-x-0 top-96">
                  <div className="h-48 overflow-y-auto bg-green-400">
                    {array.map(({ firstName, lastName, studentNumber }) => (
                      <Collapsible
                        key={studentNumber}
                        open={state.studentNumber === studentNumber}
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            className="w-full rounded-none capitalize"
                            onClick={() =>
                              setState((prevState) => ({
                                ...prevState,
                                studentNumber,
                              }))
                            }
                          >{`${firstName} ${lastName}`}</Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="bg-green-500">
                          <DisplayStudentGrades
                            gradeResult={
                              gradeResult({
                                grades: _grades,
                                specialization: state.specializationSelected!,
                              }) ?? []
                            }
                            data={gradesData.map((object) =>
                              Object.entries(object).filter(
                                ([studentNumberInner]) =>
                                  studentNumberInner === studentNumber
                              )
                            )}
                          />
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
};

const DisplayStudentGrades = (props: {
  data: [string, Omit<GradeInfo & MongoExtra, 'studentNumber'>[]][][];
  gradeResult: [string, number][];
}) => {
  return (
    <div className="fixed inset-x-0 bottom-0">
      <div className="fixed inset-x-48 top-36 grid grid-flow-col">
        <BarChart
          chartConfig={{
            career: {
              label: 'Career',
              color: 'hsl(var(--chart-1))',
            },
            grade: {
              label: 'Grade',
              color: 'hsl(var(--chart-2))',
            },
          }}
          chartData={props.gradeResult.map(([career, grade]) => ({
            career,
            grade: Math.floor(grade).toFixed(2),
          }))}
          title={'Careers'}
          description={'Showing careers based on grades.'}
          footerDescription={<p>Career Chart</p>}
        />
        <LineChart
          description="Showing careers based on internship"
          title="Internship"
          footerDescription={<p>Internship Chart</p>}
        />
      </div>
      {props.data.map((array) =>
        array.map(([studentNumber, record]) => (
          <Collapsible key={studentNumber} className="sticky top-0">
            <CollapsibleTrigger asChild>
              <Button
                className="w-full rounded-none bg-green-600"
                variant="ghost"
              >
                {`Student Number: ${studentNumber}`}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div>
                {record.map(({ _id, subjects, semester, yearLevel }) => (
                  <Collapsible key={_id}>
                    <CollapsibleTrigger asChild>
                      <Button className="w-full rounded-none">
                        {`${yearLevel} - ${semester}`.replace(/_/g, ' ')}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {subjects.map(({ code, grade }) => (
                        <div
                          key={code}
                          className="flex items-center justify-between gap-2 bg-white"
                        >
                          <p>{code.replace(/_/g, ' ')}</p>
                          <p>{grade}</p>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))
      )}
    </div>
  );
};

export default Admin;
