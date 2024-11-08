'use client';

import { useSignIn } from '@clerk/nextjs';
import React, { type FormEvent } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/hooks/redux';
import useAppRouter from '@/hooks/useAppRouter';
import { authenticationSetStatus } from '@/redux/reducers/authenticationReducer';
import regExp from '@/utils/regex';
import handleInputChange from '@/utils/handleInputChange';

const Page = () => {
  const { isLoaded, signIn } = useSignIn();
  const router = useAppRouter();
  const dispatch = useAppDispatch();

  async function initiateForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLoaded) return;

    const formdata = new FormData(event.currentTarget);

    try {
      const email = formdata.get('email');
      if (email === null) throw new Error('Email is null!');

      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email as string,
      });
      dispatch(authenticationSetStatus('verifying new password'));
      router.push('/student/verify-new-password');
    } catch (err) {
      console.log(err);
      alert('Invalid email.');
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="border-non w-3/4 rounded-none bg-transparent shadow-none">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to receive code from
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={initiateForgotPassword}
            className="flex flex-col gap-2"
          >
            <Input
              onChange={(e) => handleInputChange(e, regExp.email)}
              type="email"
              name="email"
              placeholder="Email"
              required
            />
            <Button type="submit" className="w-full">
              Send code
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
