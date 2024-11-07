'use client';

import type { GetStudentNumberResponse } from '@/server/lib/schema/apiResponse/getStudentNumber';

import { useSignUp } from '@clerk/nextjs';
import { useEffect, useState, type FormEvent } from 'react';

import { Input } from '@/components/ui/input';
import useAppRouter from '@/hooks/useAppRouter';
import regExp from '@/utils/regex';
import specializationEnum, {
  type Specialization,
} from '@/lib/enums/specialization';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  authenticationSetStatus,
  authenticationStatus,
} from '@/redux/reducers/authenticationReducer';
import {
  studentTemporaryNumber,
  studentTemporarySetSpecialization,
} from '@/redux/reducers/studentTemporaryReducer';
import type StudentCreation from '@/utils/types/studentCreation';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { SelectTrigger, SelectValue } from '@/components/ui/select';
import handleInputChange, {
  errorClasses,
  validClasses,
} from '@/utils/handleInputChange';
import CORExtractor from './CORExtractor';
import disabledWithUserList from '@/utils/authentication/disabledWithUserList';

type InitialState = {
  studentNumbers: StudentCreation['studentNumber'][];
};

/** Styling the password inputs inside the Sign Up page. */
function stylePasswordInputs(type?: 'error') {
  const passwordInputIds = ['password', 'confirmPassword'];
  const isTypeInFavorOfError = type === 'error';

  passwordInputIds.forEach((id) => {
    const input = document.querySelector(`input#${id}`) as HTMLInputElement;

    input.classList.add(
      ...(isTypeInFavorOfError ? errorClasses : validClasses)
    );
    input.classList.remove(
      ...(isTypeInFavorOfError ? validClasses : errorClasses)
    );
  });
}

const initialState: InitialState = {
  studentNumbers: [],
};

const SignupCard = () => {
  const router = useAppRouter();
  const { isLoaded, signUp } = useSignUp();
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const dispatch = useAppDispatch();
  const [state, setState] = useState(initialState);
  const _studentTemporaryNumber = studentTemporaryNumber(
    useAppSelector((s) => s.studentTemporary)
  );

  async function handleStudentCreation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formdata = new FormData(event.currentTarget);
    const emailAddress = formdata.get('email') as string;
    const password = formdata.get('password') as string;
    const studentNumber = formdata.get('studentNumber') as string;
    const confirmPassword = formdata.get('confirmPassword') as string;
    const specialization = formdata.get('specialization') as Specialization;

    if (studentNumber != _studentTemporaryNumber)
      return alert(
        `Student number in COR is ${_studentTemporaryNumber}, not ${studentNumber}!`
      );

    if (!isLoaded) return;

    try {
      if (state.studentNumbers.includes(studentNumber)) {
        throw new Error('Student number already exists!');
      }

      if (password !== confirmPassword) {
        throw new Error("Password doesn't match!");
      }

      stylePasswordInputs();
      const response = await signUp.create({
        emailAddress,
        password,
      });

      if (response === undefined) throw new Error('Signing in failed.');

      await response.prepareEmailAddressVerification();
      dispatch(studentTemporarySetSpecialization(specialization));
      dispatch(authenticationSetStatus('verifying account'));
      router.push('/student/verify-email');
    } catch (err) {
      stylePasswordInputs('error');
      const error = err as { errors?: Record<string, string>[] };
      if (error.errors === undefined) {
        return alert(err);
      }
      alert(error.errors[0].message);
    }
  }

  useEffect(() => {
    async function getStudentNumbers() {
      try {
        const response = await fetch('/api/getStudentNumber', {
          method: 'GET',
        });
        const getStudentNumber =
          (await response.json()) as GetStudentNumberResponse;

        if (getStudentNumber.data.length === 0) return;
        console.log('Setting up student numbers.');

        if (
          getStudentNumber.data.length > 0 &&
          typeof getStudentNumber.data[0] === 'string'
        ) {
          setState((prevState) => ({
            ...prevState,
            studentNumbers: getStudentNumber.data as string[],
          }));
        }
      } catch (err) {
        console.log(err);
        alert('Error in fetching student numbers.');
      }
    }
    return void getStudentNumbers();
  }, []);

  useEffect(() => {
    dispatch(authenticationSetStatus('no user'));
  }, [dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">Signup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleStudentCreation}>
          <div className="grid gap-4 p-2">
            <CORExtractor />
            <Input
              disabled={disabledWithUserList.includes(authStatus)}
              required
              onChange={(e) =>
                handleInputChange(e, new RegExp(regExp.studentNumber))
              }
              name="studentNumber"
              type="text"
              placeholder="Student number here 20xxxxxxxx"
              maxLength={10}
            />
            <Input
              required
              disabled={disabledWithUserList.includes(authStatus)}
              onChange={(e) => handleInputChange(e, regExp.email)}
              name="email"
              type="email"
              placeholder="Email"
            />
            <Select
              name="specialization"
              required
              disabled={disabledWithUserList.includes(authStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializationEnum.options.map((specialization) => {
                  return (
                    <SelectItem
                      key={specialization}
                      value={specialization}
                      className="capitalize"
                    >
                      {specialization.toLocaleLowerCase().replace(/_/g, ' ')}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Input
              disabled={disabledWithUserList.includes(authStatus)}
              required
              name="password"
              type="password"
              id="password"
              placeholder="Password"
            />
            <Input
              disabled={disabledWithUserList.includes(authStatus)}
              required
              name="confirmPassword"
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
            />
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </CardContent>
      <CardFooter className="grid">
        <CardDescription className="text-center">
          Already have an account?
        </CardDescription>
        <Button
          disabled={disabledWithUserList.includes(authStatus)}
          variant="outline"
          className="w-full"
          onClick={() => router.replace('/student/signin')}
        >
          Sign In
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignupCard;
