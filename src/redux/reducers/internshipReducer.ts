import type { InternshipTask } from '@/lib/enums/internshipTask';
import type { RootState } from '@/redux/store';

import { InitializingState } from '@/utils/types/initializingState';

import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
  internshipCompanyQuestion: boolean | InitializingState;
  internshipGrade: string;
  internshipTasks: InternshipTask[];
};
const initialState: InitialState = {
  internshipCompanyQuestion: 'initializing',
  internshipGrade: 'initializing',
  internshipTasks: [],
};

/** This is for managing the state in internship module of students. */
const internshipSlice = createSlice({
  name: 'internship',
  initialState,
  reducers: {
    internshipCompanyQuestionUpdate(
      state,
      action: { payload: (typeof initialState)['internshipCompanyQuestion'] }
    ) {
      state.internshipCompanyQuestion = action.payload;
    },
    internshipGradeUpdate(
      state,
      action: { payload: (typeof initialState)['internshipGrade'] }
    ) {
      state.internshipGrade = action.payload;
    },
    internshipTaskAdd(
      state,
      action: { payload: (typeof initialState)['internshipTasks'][number] }
    ) {
      if (!state.internshipTasks.includes(action.payload)) {
        state.internshipTasks.push(action.payload);
      }
    },
    internshipTaskRemove(
      state,
      action: { payload: (typeof initialState)['internshipTasks'][number] }
    ) {
      const index = state.internshipTasks.indexOf(action.payload);
      state.internshipTasks.splice(index, 1);
    },
    internshipResetState(state) {
      state.internshipCompanyQuestion = initialState.internshipCompanyQuestion;
      state.internshipGrade = initialState.internshipGrade;
      state.internshipTasks.splice(0);
    },
  },
});

// SELECTORS.
export const internshipCompanyQuestion = (s: RootState['internship']) =>
  s.internshipCompanyQuestion;
export const internshipGrade = (s: RootState['internship']) =>
  s.internshipGrade;
export const internshipTasks = (s: RootState['internship']) =>
  s.internshipTasks;

// ACTIONS.
export const {
  internshipCompanyQuestionUpdate,
  internshipGradeUpdate,
  internshipTaskAdd,
  internshipTaskRemove,
  internshipResetState,
} = internshipSlice.actions;
export default internshipSlice.reducer;
