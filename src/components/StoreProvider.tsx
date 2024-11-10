'use client';

import type { Children } from '@/utils/types/children';

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
  studentInfoSetMiddleInitial,
  studentInfoSetNumber,
  studentInfoSetSpecialization,
} from '@/redux/reducers/studentInfoReducer';
import {
  EMPTY_STRING,
  HEADER_KEY,
  NUMBER_OF_SEMESTER,
} from '@/utils/constants';
import {
  internshipCompanyQuestionUpdate,
  internshipGradeUpdate,
  internshipTaskAdd,
} from '@/redux/reducers/internshipReducer';
import { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import { inputControlSetPromptType } from '@/redux/reducers/inputControlReducer';
import fetchHelper from '@/utils/fetch';
import { StudentInfo } from '@/lib/schema/studentInfo';
import type layoutFetcher from '@/server/layoutFetcher';

export default function StoreProvider({
  children,
  ...rest
}: Children & Partial<StudentInfo>) {
  return (
    <Provider store={store}>
      <StoreInitializer {...rest}>{children}</StoreInitializer>
    </Provider>
  );
}

const StoreInitializer = ({
  children,
  ...rest
}: Children & Partial<StudentInfo>) => {
  const dispatch = useAppDispatch();
  const {
    firstName,
    lastName,
    middleInitial,
    specialization,
    studentNumber,
    userId,
  } = rest;

  console.log('From: Store Provider: ', {
    firstName,
    lastName,
    middleInitial,
    specialization,
    studentNumber,
    userId,
  });

  const fetchLayoutHelper = useCallback(async () => {
    const response = await fetchHelper({
      route: '/api/initializeApp',
      method: 'GET',
      params: { userId: userId ?? EMPTY_STRING },
      headers: {
        [HEADER_KEY.studentNumber]: studentNumber,
        [HEADER_KEY.specialization]: specialization,
        [HEADER_KEY.userId]: userId,
      },
    });

    const json = (await response.json()) as BaseAPIResponse<
      Awaited<ReturnType<typeof layoutFetcher>>
    >;
    console.log({ json });

    if (!response.ok) {
      return json.errorMessage.forEach((errorMessage) =>
        console.log({ errorMessage })
      );
    }
    if (typeof userId !== 'string') {
      dispatch(authenticationSetStatus('no user'));
    } else {
      dispatch(authenticationSetStatus('authenticated'));
    }

    const { certificate, grades, internship, chartData } = json.data;

    dispatch(
      authenticationSetUserType(
        studentNumber === undefined ? 'admin' : 'student'
      )
    );
    dispatch(studentInfoSetNumber(studentNumber ?? EMPTY_STRING));
    dispatch(
      studentInfoSetSpecialization(specialization ?? 'BUSINESS_ANALYTICS')
    );
    dispatch(studentInfoSetFirstname(firstName ?? EMPTY_STRING));
    dispatch(studentInfoSetMiddleInitial(middleInitial ?? EMPTY_STRING));
    dispatch(studentInfoSetLastname(lastName ?? EMPTY_STRING));

    if (certificate.length > 0) {
      certificate.forEach((certificate) =>
        dispatch(certificateAdd({ name: certificate, fileKey: '' }))
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
  }, [
    dispatch,
    userId,
    firstName,
    lastName,
    specialization,
    studentNumber,
    middleInitial,
  ]);

  useEffect(() => void fetchLayoutHelper(), [fetchLayoutHelper]);

  return <>{children}</>;
};
