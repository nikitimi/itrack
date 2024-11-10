'use client';

import { useClerk } from '@clerk/nextjs';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import useAppRouter from '@/hooks/useAppRouter';
import {
  authenticationResetState,
  authenticationSetStatus,
  authenticationStatus,
  authenticationUserType,
} from '@/redux/reducers/authenticationReducer';
import { certificateResetState } from '@/redux/reducers/certificateReducer';
import { gradeResetState } from '@/redux/reducers/gradeReducer';
import { internshipResetState } from '@/redux/reducers/internshipReducer';
import { studentInfoResetState } from '@/redux/reducers/studentInfoReducer';
import { Button } from '@/components/ui/button';
import { inputControlResetter } from '@/redux/reducers/inputControlReducer';
import { presentationResetState } from '@/redux/reducers/presentationReducer';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';
import Prompt from './Prompt';

const SignoutButton = () => {
  const clerk = useClerk();
  const router = useAppRouter();
  const dispatch = useAppDispatch();
  const authSelector = useAppSelector((s) => s.authentication);
  const authStatus = authenticationStatus(authSelector);
  const userRole = authenticationUserType(authSelector);

  function handleSignout() {
    const isAdmin = userRole === 'admin';

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
      router.replace(isAdmin ? '/admin/signin' : '/student/signin');
    });
  }
  return (
    <div className="grid">
      <Prompt
        description="Are you sure you want to sign out?"
        handleConfirmation={handleSignout}
        title="Sign out"
        trigger={
          <Button
            variant="destructive"
            className="w-full"
            disabled={disabledNoUserList.includes(authStatus)}
          >
            Signout
          </Button>
        }
      />
    </div>
  );
};

export default SignoutButton;
