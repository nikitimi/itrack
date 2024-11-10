'use client';

import { useEffect, type FormEvent } from 'react';

import { Input } from '@/components/ui/input';
import type { UserRole } from '@/lib/enums/userRole';
import type { Specialization } from '@/lib/enums/specialization';
import { useSignIn } from '@clerk/nextjs';
import {
  authenticationSetStatus,
  authenticationStatus,
} from '@/redux/reducers/authenticationReducer';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import useAppRouter from '@/hooks/useAppRouter';
import { EMPTY_STRING } from '@/utils/constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OTP from '@/components/OTP';
import getAlertMessages from '@/utils/getAlertMessages';

export type StudentCreation = {
  role: UserRole;
  userId: string;
  studentNumber: string;
  specialization: Specialization;
};

const VerifyNewPassword = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useAppRouter();
  const dispatch = useAppDispatch();
  const selector = useAppSelector((s) => s.authentication);
  const _authenticationStatus = authenticationStatus(selector);

  async function confirmForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded) return;

    try {
      const formdata = new FormData(event.currentTarget);
      const password = formdata.get('password') as string;
      const confirmPassword = formdata.get('confirmPassword');
      if (password !== confirmPassword)
        throw new Error("Password doesn't match!");

      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: formdata.get('code') as string,
        password,
      });

      setActive({ session: result.createdSessionId }).finally(() => {
        dispatch(authenticationSetStatus('authenticated'));
      });
    } catch (e) {
      const error = e as Error;
      alert(
        error.message === EMPTY_STRING
          ? getAlertMessages('student').verifyNewPassword.eightCharacters
          : error.message
      );
    }
  }

  useEffect(() => {
    if (_authenticationStatus !== 'verifying new password') {
      return router.back();
    }
  }, [_authenticationStatus, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-3/4">
        <CardHeader>
          <CardTitle>Verify new password</CardTitle>
          <CardDescription>
            The verification code has been sent into your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={confirmForgotPassword}
            className="flex flex-col gap-2"
          >
            <OTP />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              required
            />
            <Button type="submit" className="w-full">
              Submit new password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyNewPassword;
