'use client';

import type { UserRole } from '@/lib/enums/userRole';
import type { StudentType } from '@/lib/enums/studentType';
import type { Specialization } from '@/lib/enums/specialization';
import type { Certificate } from '@/lib/enums/certificate';
import type { MongoExtra } from '@/lib/schema/mongoExtra';
import type { Children } from '@/utils/types/children';
import type GradeInfo from '@/utils/types/gradeInfo';

import { useCallback, useEffect } from 'react';
import { Provider } from 'react-redux';

import { useAppDispatch } from '@/hooks/redux';
import {
  authenticationSetStatus,
  authenticationSetUserType,
} from '@/redux/reducers/authenticationReducer';
import { certificateAdd } from '@/redux/reducers/certificateReducer';
import { gradesAdd } from '@/redux/reducers/gradeReducer';
import store from '@/redux/store';
import {
  studentInfoSetChartData,
  studentInfoSetFirstname,
  studentInfoSetLastname,
  studentInfoSetNumber,
  studentInfoSetSpecialization,
} from '@/redux/reducers/studentInfoReducer';
import { NUMBER_OF_SEMESTER } from '@/utils/constants';
import { InternshipResult } from '@/utils/types/internshipResult';
import {
  internshipCompanyQuestionUpdate,
  internshipGradeUpdate,
  internshipTaskAdd,
} from '@/redux/reducers/internshipReducer';
import { ChartData } from '@/utils/types/chartData';
import { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import { useAuth } from '@clerk/nextjs';
import { inputControlSetPromptType } from '@/redux/reducers/inputControlReducer';

type LayoutFetcher = {
  userId: string | null;
  specialization: Specialization;
  studentType: StudentType;
  studentNumber: string;
  role: UserRole;
  grades: (GradeInfo & MongoExtra)[];
  certificate: Certificate[];
  internship?: Omit<InternshipResult, 'status'> & MongoExtra;
  firstName: string;
  lastName: string;
  chartData: ChartData[];
};

export default function StoreProvider({ children }: Children) {
  return (
    <Provider store={store}>
      <StoreInitializer>{children}</StoreInitializer>
    </Provider>
  );
}

const StoreInitializer = ({ children }: Children) => {
  const dispatch = useAppDispatch();
  const { userId } = useAuth();

  console.log({ userId });

  const fetchLayoutHelper = useCallback(async () => {
    const response = await fetch('/api/initializeApp', {
      method: 'GET',
    });
    const json = (await response.json()) as BaseAPIResponse<LayoutFetcher>;

    if (!response.ok) {
      return json.errorMessage.forEach((errorMessage) =>
        console.log(errorMessage)
      );
    }
    if (typeof userId !== 'string') {
      dispatch(authenticationSetStatus('no user'));
    } else {
      dispatch(authenticationSetStatus('authenticated'));
    }

    const {
      certificate,
      grades,
      internship,
      chartData,
      role,
      specialization,
      studentNumber,
      lastName,
      firstName,
    } = json.data;

    dispatch(authenticationSetUserType(role));
    dispatch(studentInfoSetNumber(studentNumber));
    dispatch(studentInfoSetSpecialization(specialization));
    dispatch(studentInfoSetFirstname(firstName));
    dispatch(studentInfoSetLastname(lastName));

    if (certificate.length > 0) {
      certificate.forEach((certificate) =>
        dispatch(certificateAdd(certificate))
      );
      dispatch(
        inputControlSetPromptType({
          key: 'certificateModule',
          promptType: 'fetched from server',
        })
      );
    } else {
      dispatch(
        inputControlSetPromptType({
          key: 'certificateModule',
          promptType: 'no document',
        })
      );
    }

    if (internship !== undefined) {
      const { isITCompany, grade, tasks } = internship;
      dispatch(internshipCompanyQuestionUpdate(isITCompany));
      dispatch(internshipGradeUpdate(grade));
      tasks.forEach((task) => {
        dispatch(internshipTaskAdd(task));
      });
      dispatch(
        inputControlSetPromptType({
          key: 'internshipModule',
          promptType: 'fetched from server',
        })
      );
    } else {
      dispatch(
        inputControlSetPromptType({
          key: 'internshipModule',
          promptType: 'no document',
        })
      );
    }

    if (grades.length === NUMBER_OF_SEMESTER) {
      dispatch(
        inputControlSetPromptType({
          key: 'gradeModule',
          promptType: 'fetched from server',
        })
      );
    } else if (grades.length === 0) {
      dispatch(
        inputControlSetPromptType({
          key: 'gradeModule',
          promptType: 'no document',
        })
      );
    } else {
      dispatch(
        inputControlSetPromptType({
          key: 'gradeModule',
          promptType: 'missing document',
        })
      );
    }

    grades.forEach((gradeInfo) => dispatch(gradesAdd(gradeInfo)));
    chartData.forEach((c) => dispatch(studentInfoSetChartData(c)));
  }, [dispatch, userId]);

  useEffect(() => void fetchLayoutHelper(), [fetchLayoutHelper]);

  return <>{children}</>;
};
