'use client';

import { useSignUp } from '@clerk/nextjs';
import {
  authenticationSetStatus,
  authenticationStatus,
} from '@/redux/reducers/authenticationReducer';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import useAppRouter from '@/hooks/useAppRouter';
import {
  studentTemporaryFirstname,
  studentTemporaryLastname,
  studentTemporaryMiddleInitial,
  studentTemporaryNumber,
  studentTemporaryResetState,
  studentTemporarySpecialization,
} from '@/redux/reducers/studentTemporaryReducer';
import type StudentCreation from '@/utils/types/studentCreation';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { useEffect, useRef } from 'react';
import { EMPTY_STRING } from '@/utils/constants';

const VerifyEmail = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useAppRouter();
  const otpRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const studentInfoSelector = useAppSelector((s) => s.studentTemporary);
  const _studentInfoNumber = studentTemporaryNumber(studentInfoSelector);
  const firstName = studentTemporaryFirstname(studentInfoSelector);
  const lastName = studentTemporaryLastname(studentInfoSelector);
  const middleInitial = studentTemporaryMiddleInitial(studentInfoSelector);
  const _studentInfoSpecialization =
    studentTemporarySpecialization(studentInfoSelector);
  const _authenticationStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );

  const OTP_LENGTH = 6;

  async function handleVerificationCode(newValue: string) {
    if (newValue.length < OTP_LENGTH) return;
    if (!isLoaded) return;
    if (otpRef.current === null) return;

    try {
      otpRef.current.setAttribute('disabled', 'true');

      const result = await signUp.attemptEmailAddressVerification({
        code: newValue,
      });

      if (result.createdUserId === null) {
        throw new Error(result.status?.toString());
      }

      const studentData: StudentCreation = {
        role: 'student',
        lastName,
        firstName,
        middleInitial,
        userId: result.createdUserId,
        studentNumber: _studentInfoNumber.toLocaleString(),
        specialization: _studentInfoSpecialization,
      };
      const response = await fetch('/api/addUserType', {
        method: 'POST',
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error('Error in assigning role to the student.');
      }
      setActive({ session: result.createdSessionId }).finally(() => {
        dispatch(studentTemporaryResetState());
        dispatch(authenticationSetStatus('authenticated'));
      });
    } catch (e) {
      otpRef.current.removeAttribute('disabled');
      const error = e as Error;
      alert(
        error.message === EMPTY_STRING
          ? 'Error in verifying code'
          : error.message
      );
    }
  }

  useEffect(() => {
    if (_authenticationStatus !== 'verifying account') {
      return router.back();
    }
  }, [_authenticationStatus, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-3/4 p-4 duration-300 ease-in-out lg:w-1/2">
        <CardDescription>
          <CardTitle>Account Verification</CardTitle>
          <CardDescription>
            We&apos;ve sent verification code to the email you&apos;ve provided.
          </CardDescription>
        </CardDescription>
        <CardContent className="flex items-center justify-center">
          <InputOTP
            id="otp-code"
            ref={otpRef}
            required
            maxLength={OTP_LENGTH}
            onChange={handleVerificationCode}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
