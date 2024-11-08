'use client';

import regExp from '@/utils/regex';
import { Separator } from '@radix-ui/react-separator';
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import useAppRouter from '@/hooks/useAppRouter';
import {
  authenticationSetStatus,
  authenticationStatus,
} from '@/redux/reducers/authenticationReducer';
import { useSignIn } from '@clerk/nextjs';
import handleInputChange from '@/utils/handleInputChange';
import AppLogo from '@/components/AppLogo';
import disabledWithUserList from '@/utils/authentication/disabledWithUserList';

const SigninCard = () => {
  const router = useAppRouter();
  const dispatch = useAppDispatch();
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const { signIn, isLoaded, setActive } = useSignIn();

  async function handleSignin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLoaded) return console.log('clerk is still loading');

    const formdata = new FormData(event.currentTarget);
    try {
      const result = await signIn.create({
        identifier: formdata.get('email') as string,
        password: formdata.get('password') as string,
      });

      switch (result.status) {
        case 'complete':
          return setActive({ session: result.createdSessionId })
            .then(() => dispatch(authenticationSetStatus('initializing')))
            .finally(() => {
              dispatch(authenticationSetStatus('authenticated'));
              router.replace('/student');
            });
      }
    } catch (e) {
      const error = e as Error;
      dispatch(authenticationSetStatus('no user'));
      console.log(error.message);
      console.log(signIn);
      if (isLoaded) {
        switch (signIn.status) {
          case 'needs_first_factor':
            return alert(
              'Ongoing password verification failed\nPlease forgot your password again then complete the process.'
            );
          case 'needs_identifier':
            return alert("Account doesn't exists.");
          case null:
            return alert('');
          default:
            alert(signIn.status);
        }
      }
    }
  }

  useEffect(() => {
    dispatch(authenticationSetStatus('no user'));
  }, [dispatch]);

  return (
    <Card className="mx-8 w-full duration-200 ease-in-out md:mx-0 md:w-3/4 lg:w-1/3">
      <CardHeader>
        <AppLogo />
        <CardTitle className="text-center">Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignin} className="grid grid-flow-row gap-4 p-2">
          <Input
            disabled={disabledWithUserList.includes(authStatus)}
            className="border-2"
            onChange={(e) => handleInputChange(e, regExp.email)}
            type="email"
            name="email"
            placeholder="Email"
            required
          />
          <Input
            disabled={disabledWithUserList.includes(authStatus)}
            className="border-2"
            onChange={(e) => handleInputChange(e, /[\D\d]{8}/g)}
            minLength={8}
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <Button type="submit">Sign In</Button>
        </form>
        <div className="w-full">
          <Button
            disabled={disabledWithUserList.includes(authStatus)}
            variant="link"
            type="button"
            className="w-full"
            onClick={() => router.replace('/student/forgot-password')}
          >
            Forgot Password?
          </Button>
        </div>
      </CardContent>
      <CardFooter className="grid gap-2">
        <Separator />
        <CardDescription className="text-center text-black">
          Don&apos;t have an account?
        </CardDescription>
        <Button
          disabled={disabledWithUserList.includes(authStatus)}
          variant="outline"
          onClick={() => router.replace('/student/signup')}
        >
          Sign Up
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SigninCard;
