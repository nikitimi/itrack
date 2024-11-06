import type { RootState } from '@/redux/store';

import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
  completion: string[];
};

const initialState: InitialState = {
  completion: [],
};

/** This is for managing the state in grade module of students. */
const presentationSlice = createSlice({
  name: 'presentation',
  initialState,
  reducers: {
    presentationCompletionUpdate(
      state,
      action: { payload: InitialState['completion'][number] }
    ) {
      if (!state.completion.includes(action.payload)) {
        state.completion.push(action.payload);
      }
    },
    presentationCompletionUpdateWithMissingGrades(
      state,
      action: { payload: InitialState['completion'][number] }
    ) {
      if (!state.completion.includes(action.payload)) {
        state.completion = state.completion.filter(
          (v) => !v.startsWith('grade')
        );
        state.completion.push(action.payload);
      }
    },
    presentationResetState(state) {
      state.completion.splice(0);
    },
  },
});

// SELECTORS.
export const presentationCompletion = (s: RootState['presentation']) =>
  s.completion;

// ACTIONS.
export const {
  presentationCompletionUpdate,
  presentationCompletionUpdateWithMissingGrades,
  presentationResetState,
} = presentationSlice.actions;
export default presentationSlice.reducer;
