'use client';

import { useSignUp } from '@clerk/nextjs';

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
import { useEffect, useRef } from 'react';
import { EMPTY_STRING } from '@/utils/constants';
import type { StudentInfo } from '@/lib/schema/studentInfo';
import getAlertMessages from '@/utils/getAlertMessages';

const VerifyEmailCard = () => {
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

      const studentData: StudentInfo = {
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
          ? getAlertMessages('student').verifyEmail.errorVerifying
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
    <Card className="mx-8 w-full duration-200 ease-in-out md:mx-0 md:w-3/4 lg:w-1/3">
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
  );
};

export default VerifyEmailCard;
