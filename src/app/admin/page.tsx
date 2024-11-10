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
              {/* <Select>
                <SelectTrigger className="capitalize">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesterEnum.options.map((v) => (
                    <SelectItem key={v} className="capitalize" value={v}>
                      {constantNameFormatter(v)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="capitalize">
                  <SelectValue placeholder="Year Level" />
                </SelectTrigger>
                <SelectContent>
                  {gradeLevelEnum.options.map((v) => (
                    <SelectItem key={v} className="capitalize" value={v}>
                      {constantNameFormatter(v)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </div>
          </section>
        </CardHeader>
        <CardContent
          className="grid h-1/3 gap-4 overflow-y-auto bg-slate-100 py-4"
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

// const Filters = ({array, onChange}: {array: string[]} & HTMLAttributes<HTMLSelectElement>) => {
//   return (
//     <Select>
//       <SelectTrigger className="capitalize">
//         <SelectValue placeholder="Specialization" />
//       </SelectTrigger>
//       <SelectContent>
//         {array.map((v) => (
//           <SelectItem key={v} className="capitalize" value={v}>
//             {constantNameFormatter(v)}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   );
// };

export default Admin;
