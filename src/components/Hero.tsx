'use client';

import { useAppSelector } from '@/hooks/redux';
import {
  studentInfoNumber,
  studentInfoFirstname,
  studentInfoLastname,
  studentInfoSpecialization,
} from '@/redux/reducers/studentInfoReducer';
import { useEffect, useState } from 'react';
import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import getStudentType from '@/utils/getStudentType';

type InitialState = 'loading' | 'ready';
const initialState = 'loading';

const Hero = () => {
  {
    /* <Button onClick={() => void signOut()}>Signout</Button> */
  }
  const [status, setStatus] = useState<InitialState>(initialState);
  const isReady = status === 'ready';
  const loadingText = 'loading...';

  const studentInfoSelector = useAppSelector((s) => s.studentInfo);
  const _studentNumber = studentInfoNumber(studentInfoSelector);
  const _specialization = studentInfoSpecialization(studentInfoSelector);
  const firstName = studentInfoFirstname(studentInfoSelector);
  const lastName = studentInfoLastname(studentInfoSelector);
  const fullName = `${firstName} ${lastName}`;

  useEffect(() => {
    setStatus('ready');
  }, []);

  if (isReady) {
    return (
      <Card className="mx-6 mt-12 lg:mx-16">
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
          <CardDescription className="capitalize">{`Welcome ${fullName}!`}</CardDescription>
        </CardHeader>
        <CardContent>
          <LabelHelper
            label="Specialization:"
            value={_specialization?.replace(/_/g, ' ').toLocaleLowerCase()}
          />
          <LabelHelper
            label="Student Type:"
            value={getStudentType(_studentNumber)}
          />
          <LabelHelper label="Student Number:" value={_studentNumber} />
        </CardContent>
      </Card>
    );
  }
  // TODO: Add loading here.
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Information</CardTitle>
        <CardDescription>
          All information you provided resides here...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LabelHelper label="Specialization:" value={loadingText} />
        <LabelHelper label="Student Type:" value={loadingText} />
        <LabelHelper label="Student Number:" value={loadingText} />
      </CardContent>
    </Card>
  );
};

const LabelHelper = (props: { label: string; value: string }) => {
  return (
    <section className="grid grid-cols-2 items-center">
      <Label>{props.label}</Label>
      <Input value={props.value} className="border-none capitalize" disabled />
    </section>
  );
};

export default Hero;
