import type { Certificate } from '@/lib/enums/certificate';
import { MongoExtra } from '@/lib/schema/mongoExtra';
import type { RootState } from '@/redux/store';

import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
  certificate: {
    certificateList: { name: Certificate; fileKey: string }[];
  } & Partial<MongoExtra>;
};
const initialState: InitialState = {
  certificate: { certificateList: [] },
};

/** This is for managing the state in certificate module of students. */
const certificateSlice = createSlice({
  name: 'certificate',
  initialState,
  reducers: {
    certificateAdd(
      state,
      action: {
        payload: (typeof initialState)['certificate']['certificateList'][number];
      }
    ) {
      if (
        !state.certificate.certificateList
          .flatMap((c) => c.name)
          .includes(action.payload.name)
      ) {
        state.certificate.certificateList.push(action.payload);
      }
    },
    certificateAddFile(
      state,
      action: {
        payload: (typeof initialState)['certificate']['certificateList'][number];
      }
    ) {
      const index = state.certificate.certificateList
        .flatMap((c) => c.name)
        .indexOf(action.payload.name);
      if (index > -1) {
        const removedCertificate = state.certificate.certificateList.splice(
          index,
          1
        )[0];
        state.certificate.certificateList.push({
          ...removedCertificate,
          fileKey: action.payload.fileKey,
        });
      }
    },
    certificateRemove(
      state,
      action: {
        payload: (typeof initialState)['certificate']['certificateList'][number]['name'];
      }
    ) {
      const index = state.certificate.certificateList
        .flatMap((c) => c.name)
        .indexOf(action.payload);
      if (index > -1) {
        state.certificate.certificateList.splice(index, 1);
      }
    },
    certificateResetState(state) {
      state.certificate.certificateList.splice(0);
    },
  },
});

// SELECTORS.

export const certificateList = (s: RootState['certificate']) =>
  s.certificate.certificateList;

// ACTIONS.
export const {
  certificateAdd,
  certificateAddFile,
  certificateRemove,
  certificateResetState,
} = certificateSlice.actions;
export default certificateSlice.reducer;
