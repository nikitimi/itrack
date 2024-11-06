'use client';

import { useClerk } from '@clerk/nextjs';

import { useAppDispatch } from '@/hooks/redux';
import useAppRouter from '@/hooks/useAppRouter';
import {
  authenticationResetState,
  authenticationSetStatus,
} from '@/redux/reducers/authenticationReducer';
import { certificateResetState } from '@/redux/reducers/certificateReducer';
import { gradeResetState } from '@/redux/reducers/gradeReducer';
import { internshipResetState } from '@/redux/reducers/internshipReducer';
import { studentInfoResetState } from '@/redux/reducers/studentInfoReducer';
import { Button } from './ui/button';
import { inputControlResetter } from '@/redux/reducers/inputControlReducer';
import { presentationResetState } from '@/redux/reducers/presentationReducer';

const SignoutButton = () => {
  const clerk = useClerk();
  const router = useAppRouter();
  const dispatch = useAppDispatch();

  function handleSignout() {
    dispatch(authenticationSetStatus('initializing'));
    clerk.signOut().finally(() => {
      dispatch(authenticationResetState());
      dispatch(certificateResetState());
      dispatch(gradeResetState());
      dispatch(internshipResetState());
      dispatch(studentInfoResetState());
      dispatch(inputControlResetter());
      dispatch(presentationResetState());
      dispatch(authenticationSetStatus('no user'));
      router.replace('/student/signin');
    });
  }
  return (
    <div className="grid">
      <Button variant="destructive" onClick={handleSignout}>
        Signout
      </Button>
    </div>
  );
};

export default SignoutButton;
