import type { RootState } from '@/redux/store';

import { createSlice } from '@reduxjs/toolkit';

import type { GradeInfo } from '@/lib/schema/gradeInfo';

type InitialState = {
  grades: GradeInfo[];
};
const initialState: InitialState = {
  grades: [],
};

/** This is for managing the state in grade module of students. */
const gradeSlice = createSlice({
  name: 'grade',
  initialState,
  reducers: {
    gradesAdd(state, action: { payload: InitialState['grades'][number] }) {
      const { yearLevel, semester } = action.payload;
      const filteredResult = state.grades.filter(
        (g) => g.yearLevel === yearLevel && g.semester === semester
      );
      if (filteredResult.length === 0) state.grades.push(action.payload);
    },

    gradeResetState(state) {
      state.grades.splice(0);
    },
  },
});

// SELECTORS.
export const grades = (s: RootState['grade']) => s.grades;

// ACTIONS.
export const { gradesAdd, gradeResetState } = gradeSlice.actions;
export default gradeSlice.reducer;
