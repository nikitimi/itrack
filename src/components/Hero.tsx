'use client';

import { useAppSelector } from '@/hooks/redux';
import {
  studentInfoNumber,
  studentInfoFirstname,
  studentInfoLastname,
  studentInfoSpecialization,
} from '@/redux/reducers/studentInfoReducer';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import getStudentType from '@/utils/getStudentType';
import { SidebarMenuSkeleton } from './ui/sidebar';
import { Input } from './ui/input';

type InitialState = 'loading' | 'ready';
const initialState = 'loading';

const Hero = () => {
  {
    /* <Button onClick={() => void signOut()}>Signout</Button> */
  }
  const [status, setStatus] = useState<InitialState>(initialState);
  const isReady = status === 'ready';

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
      <Card className="mx-4">
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
    <Card className="mx-4">
      <CardHeader>
        <CardTitle>Student Information</CardTitle>
        <CardDescription>
          <SidebarMenuSkeleton />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LabelHelper label="Specialization:" value={<SidebarMenuSkeleton />} />
        <LabelHelper label="Student Type:" value={<SidebarMenuSkeleton />} />
        <LabelHelper label="Student Number:" value={<SidebarMenuSkeleton />} />
      </CardContent>
    </Card>
  );
};

const LabelHelper = (props: { label: string; value: React.ReactNode }) => {
  return (
    <section className="grid grid-cols-2 items-center">
      <Label>{props.label}</Label>
      {typeof props.value === 'string' ? (
        <Input
          value={props.value}
          className="border-none capitalize shadow-none"
          disabled
        />
      ) : (
        props.value
      )}
    </section>
  );
};

export default Hero;
