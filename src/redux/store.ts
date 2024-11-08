import { configureStore } from '@reduxjs/toolkit';
import authenticationReducer from '@/redux/reducers/authenticationReducer';
import certificateReducer from '@/redux/reducers/certificateReducer';
import gradeReducer from '@/redux/reducers/gradeReducer';
import internshipReducer from '@/redux/reducers/internshipReducer';
import studentInfoReducer from '@/redux/reducers/studentInfoReducer';
import studentTemporaryReducer from '@/redux/reducers/studentTemporaryReducer';
import inputControlReducer from '@/redux/reducers/inputControlReducer';
import presentationReducer from '@/redux/reducers/presentationReducer';

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    inputControl: inputControlReducer,
    certificate: certificateReducer,
    grade: gradeReducer,
    internship: internshipReducer,
    presentation: presentationReducer,
    studentInfo: studentInfoReducer,
    studentTemporary: studentTemporaryReducer,
  },
});

export default store;
