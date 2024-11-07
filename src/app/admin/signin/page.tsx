'use client';

import AppLogo from '@/components/AppLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/hooks/redux';
import useAppRouter from '@/hooks/useAppRouter';
import {
  authenticationSetStatus,
  authenticationSetUserType,
} from '@/redux/reducers/authenticationReducer';
import { useSignIn } from '@clerk/nextjs';
import React, { FormEvent } from 'react';

const Signin = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const dispatch = useAppDispatch();
  const router = useAppRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    dispatch(authenticationSetStatus('initializing'));
    event.preventDefault();
    const formdata = new FormData(event.currentTarget);

    const email = formdata.get('email') as string;
    const password = formdata.get('password') as string;

    if (!isLoaded) return console.log('useSignIn not yet loaded.');

    const result = await signIn.create({
      identifier: email,
      password,
    });

    if (result.status !== 'complete') {
      dispatch(authenticationSetStatus('no user'));
      return console.log(result);
    }

    setActive({
      session: result.createdSessionId,
    }).then(() => {
      dispatch(authenticationSetUserType('admin'));
      router.replace('/admin');
    });
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="mx-8 w-full duration-200 ease-in-out md:mx-0 md:w-3/4 lg:w-1/3">
        <CardHeader>
          <AppLogo />
          <CardTitle className="text-center">Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-flow-row gap-4 p-2"
          >
            <Input
              type="email"
              name="email"
              required
              placeholder="Enter you email"
            />
            <Input
              type="password"
              name="password"
              required
              placeholder="Enter you password"
            />
            <Button type="submit">Signin</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signin;
