import type { Specialization } from '@/lib/enums/specialization';
import type { RootState } from '@/redux/store';

import { createSlice } from '@reduxjs/toolkit';

import { EMPTY_STRING } from '@/utils/constants';

type InitialState = {
  specialization: Specialization;
  studentNumber: string;
  firstName: string;
  lastName: string;
  middleInitial: string;
};
/** `studentNumber`: ***'null'*** if userType is ***'anonymous'***.
 *
 * `studentType`: Validation of student number to the year is dependent here,
 * if ***'null'*** there is no student logged in aka. ***'anonymous'***.
 *
 * `userType`: ***'admin'*** is logged in, ***'student'*** is logged in. else ***'anonymous'***.
 * */
const initialState: InitialState = {
  specialization: 'BUSINESS_ANALYTICS',
  studentNumber: EMPTY_STRING,
  firstName: EMPTY_STRING,
  lastName: EMPTY_STRING,
  middleInitial: EMPTY_STRING,
};

/** This is for managing the state in studentTemporary module of students. */
const studentInfoSlice = createSlice({
  name: 'studentTemporary',
  initialState,
  reducers: {
    studentTemporarySetNumber(
      state,
      action: { payload: InitialState['studentNumber'] }
    ) {
      state.studentNumber = action.payload;
    },
    studentTemporarySetSpecialization(
      state,
      action: { payload: InitialState['specialization'] }
    ) {
      state.specialization = action.payload;
    },
    studentTemporarySetFirstname(
      state,
      action: { payload: InitialState['firstName'] }
    ) {
      state.firstName = action.payload;
    },
    studentTemporarySetMiddleInitial(
      state,
      action: { payload: InitialState['middleInitial'] }
    ) {
      state.middleInitial = action.payload;
    },
    studentTemporarySetLastname(
      state,
      action: { payload: InitialState['lastName'] }
    ) {
      state.lastName = action.payload;
    },
    studentTemporaryResetState(state) {
      state.specialization = initialState.specialization;
      state.studentNumber = initialState.studentNumber;
      state.firstName = initialState.firstName;
      state.middleInitial = initialState.middleInitial;
      state.lastName = initialState.lastName;
    },
  },
});

// SELECTORS.
export const studentTemporaryFirstname = (a: RootState['studentTemporary']) =>
  a.firstName;
export const studentTemporaryMiddleInitial = (
  a: RootState['studentTemporary']
) => a.middleInitial;
export const studentTemporaryLastname = (a: RootState['studentTemporary']) =>
  a.lastName;
export const studentTemporaryNumber = (a: RootState['studentTemporary']) =>
  a.studentNumber;
export const studentTemporarySpecialization = (
  a: RootState['studentTemporary']
) => a.specialization;

// ACTIONS.
export const {
  studentTemporaryResetState,
  studentTemporarySetNumber,
  studentTemporarySetFirstname,
  studentTemporarySetMiddleInitial,
  studentTemporarySetLastname,
  studentTemporarySetSpecialization,
} = studentInfoSlice.actions;
export default studentInfoSlice.reducer;
