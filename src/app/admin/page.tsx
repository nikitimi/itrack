'use client';

import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
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
import {
  gradeResetState,
  grades,
  gradesAdd,
} from '@/redux/reducers/gradeReducer';
import gradeResult from '@/features/grade/student/utils/gradeResult';
import BarChart from '@/components/charts/BarChart';
import {
  internshipCompanyQuestionUpdate,
  internshipGradeUpdate,
  internshipTaskAdd,
} from '@/redux/reducers/internshipReducer';
import { inputControlSetPromptType } from '@/redux/reducers/inputControlReducer';
import { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import { authenticationSetStatus } from '@/redux/reducers/authenticationReducer';
import { UserRole } from '@/lib/enums/userRole';
import { InternshipResult } from '@/utils/types/internshipResult';

type InitialState = {
  grades: Record<string, Omit<GradeInfo & MongoExtra, 'studentNumber'>[]>[];
  studentData: StudentInformation[];
  specializationSelected: Specialization | null;
  studentNumber: string | null;
  internshipData: Record<string, (InternshipResult & MongoExtra)[]>[];
};

type StudentInformation = {
  firstName: string;
  lastName: string;
  role: UserRole;
  studentNumber: string;
  specialization: Specialization;
};

const initialState: InitialState = {
  grades: [],
  studentData: [],
  internshipData: [],
  specializationSelected: null,
  studentNumber: null,
};

const Admin = () => {
  const [state, setState] = useState(initialState);
  const cardRef = useRef<HTMLDivElement>(null);
  const _grades = grades(useAppSelector((s) => s.grade));
  const dispatch = useAppDispatch();

  const studentDataGroupedBySpecialization = specializationEnum.options.map(
    (specialization) => ({
      [specialization]: state.studentData
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
      filteredInternshipData?.forEach((internshipInfo) =>
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
    return () => {
      dispatch(authenticationSetStatus('authenticated'));
    };
  }, [dispatch, state.studentNumber, state.grades, state.internshipData]);

  useEffect(() => {
    async function initializeStudentInformation() {
      /** Clerk public metadata cannot be acccessed inside functions. Maybe must be root level. */
      const response = await fetch(`/api/mongo/grades?role=admin`, {
        method: 'GET',
      });
      const { data, errorMessage } = (await response.json()) as BaseAPIResponse<
        InitialState['grades']
      >;

      if (!response.ok) return alert(`Grades: ${errorMessage[0]}`);
      const getStudentInformationsResponse = await fetch(
        '/api/getStudentInformations',
        {
          method: 'GET',
        }
      );
      const getStudentInformationsJson =
        (await getStudentInformationsResponse.json()) as BaseAPIResponse<
          StudentInformation[]
        >;
      if (!getStudentInformationsResponse.ok) {
        return alert(
          `Student informations: ${getStudentInformationsJson.errorMessage[0]}`
        );
      }
      setState((prevState) => ({
        ...prevState,
        grades: data,
        studentData: getStudentInformationsJson.data,
      }));
    }
    return void initializeStudentInformation();
  }, [dispatch]);

  console.log(state);

  return (
    <>
      <Header />
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
                      dispatch(gradeResetState());
                    }}
                  >
                    {specialization.replace(/_/g, ' ').toLocaleLowerCase()}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="absolute inset-x-0 top-96">
                  <div className="h-48 overflow-y-auto bg-slate-50">
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
                        <CollapsibleContent className="bg-green-200">
                          <DisplayStudentGrades
                            gradeResult={
                              gradeResult({
                                grades: _grades,
                                specialization: state.specializationSelected!,
                              }) ?? []
                            }
                            data={state.grades.map((object) =>
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
  console.log(props);
  return (
    <div className="fixed inset-x-0 bottom-0">
      <div className="fixed inset-x-96 top-36 grid grid-flow-col">
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
        {/* <LineChart
          description="Showing careers based on internship"
          title="Internship"
          footerDescription={<p>Internship Chart</p>}
        /> */}
      </div>
      {props.data.map((array) =>
        array.map(([studentNumber, record]) => (
          <Collapsible key={studentNumber} className="sticky top-0">
            <CollapsibleTrigger asChild>
              <Button
                className="w-full rounded-none bg-slate-100"
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
