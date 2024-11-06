import type { Specialization } from '@/lib/enums/specialization';
import type { RootState } from '@/redux/store';

import { createSlice } from '@reduxjs/toolkit';

import { EMPTY_STRING } from '@/utils/constants';
import { ChartData } from '@/utils/types/chartData';

type StudentInfo = {
  specialization: Specialization;
  studentNumber: string;
  chartData: ChartData[];
  firstName: string;
  lastName: string;
};

type InitialState = StudentInfo;

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
  chartData: [],
  firstName: EMPTY_STRING,
  lastName: EMPTY_STRING,
};

/** This is for managing the state in studentInfo module of students. */
const studentInfoSlice = createSlice({
  name: 'studentInfo',
  initialState,
  reducers: {
    studentInfoSetFirstname(
      state,
      action: { payload: InitialState['firstName'] }
    ) {
      state.firstName = action.payload;
    },
    studentInfoSetLastname(
      state,
      action: { payload: InitialState['lastName'] }
    ) {
      state.lastName = action.payload;
    },
    studentInfoSetNumber(
      state,
      action: { payload: InitialState['studentNumber'] }
    ) {
      state.studentNumber = action.payload;
    },
    studentInfoSetSpecialization(
      state,
      action: { payload: InitialState['specialization'] }
    ) {
      state.specialization = action.payload;
    },
    studentInfoSetChartData(
      state,
      action: { payload: InitialState['chartData'][number] }
    ) {
      const jobs = state.chartData.flatMap((s) => s.job);
      if (jobs.indexOf(action.payload.job) === -1) {
        state.chartData.push(action.payload);
      }
    },
    studentInfoResetState(state) {
      state.specialization = initialState.specialization;
      state.studentNumber = initialState.studentNumber;
      state.chartData.splice(0);
      state.firstName = initialState.firstName;
      state.lastName = initialState.lastName;
    },
  },
});

// SELECTORS.
export const studentInfoChartData = (a: RootState['studentInfo']) =>
  a.chartData;
export const studentInfoFirstname = (a: RootState['studentInfo']) =>
  a.firstName;
export const studentInfoLastname = (a: RootState['studentInfo']) => a.lastName;
export const studentInfoNumber = (a: RootState['studentInfo']) =>
  a.studentNumber;
export const studentInfoSpecialization = (a: RootState['studentInfo']) =>
  a.specialization;

// ACTIONS.
export const {
  studentInfoResetState,
  studentInfoSetFirstname,
  studentInfoSetLastname,
  studentInfoSetNumber,
  studentInfoSetChartData,
  studentInfoSetSpecialization,
} = studentInfoSlice.actions;
export default studentInfoSlice.reducer;
