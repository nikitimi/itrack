'use client';

import { useAppSelector } from '@/hooks/redux';
import {
  studentInfoNumber,
  studentInfoFirstname,
  studentInfoLastname,
  studentInfoSpecialization,
} from '@/redux/reducers/studentInfoReducer';
import React from 'react';
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
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';

const Hero = () => {
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );

  const studentInfoSelector = useAppSelector((s) => s.studentInfo);
  const _studentNumber = studentInfoNumber(studentInfoSelector);
  const _specialization = studentInfoSpecialization(studentInfoSelector);
  const firstName = studentInfoFirstname(studentInfoSelector);
  const lastName = studentInfoLastname(studentInfoSelector);
  const fullName = `${firstName} ${lastName}`;

  switch (authStatus) {
    case 'initializing':
      return (
        <Card className="mx-4">
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>
              <SidebarMenuSkeleton />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LabelHelper
              label="Specialization:"
              value={<SidebarMenuSkeleton />}
            />
            <LabelHelper
              label="Student Type:"
              value={<SidebarMenuSkeleton />}
            />
            <LabelHelper
              label="Student Number:"
              value={<SidebarMenuSkeleton />}
            />
          </CardContent>
        </Card>
      );
    case 'no user':
    case 'verifying account':
    case 'verifying new password':
      return <></>;
    case 'authenticated':
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
