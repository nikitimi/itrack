'use client';

import { useAppSelector } from '@/hooks/redux';
import { grades } from '@/redux/reducers/gradeReducer';
import React from 'react';
import gradeResult from '../utils/gradeResult';
import { studentInfoSpecialization } from '@/redux/reducers/studentInfoReducer';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';

/** This will show Result of COG. */
const GradeConfirmation = () => {
  const _grades = grades(useAppSelector((s) => s.grade));
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const specialization = studentInfoSpecialization(
    useAppSelector((s) => s.studentInfo)
  );

  return (
    <div>
      <button
        disabled={disabledNoUserList.includes(authStatus)}
        onClick={() =>
          console.log(gradeResult({ grades: _grades, specialization }))
        }
      >
        Confirm
      </button>
    </div>
  );
};

export default GradeConfirmation;
