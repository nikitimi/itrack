'use client';

import { Button } from '@/components/ui/button';
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
    <div>
      <form onSubmit={handleSubmit}>
        <Input type="email" name="email" required />
        <Input type="password" name="password" required />
        <Button type="submit">Signin</Button>
      </form>
    </div>
  );
};

export default Signin;
