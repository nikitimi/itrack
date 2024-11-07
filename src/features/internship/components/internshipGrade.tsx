'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from '@/components/ui/select';
//eslint-disable-next-line boundaries/element-types
import gradeSystem from '@/features/grade/student/utils/gradeSystem';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';
import {
  internshipGrade,
  internshipGradeUpdate,
} from '@/redux/reducers/internshipReducer';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';

const InternshipGrade = () => {
  const dispatch = useAppDispatch();
  const gradeScale = gradeSystem.flatMap((g) => g.scale);
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const _internshipGrade = internshipGrade(useAppSelector((s) => s.internship));

  function handleGradeChange(value: (typeof gradeScale)[number]) {
    dispatch(internshipGradeUpdate(value));
  }

  return (
    <Card className="rounded-none border-none bg-transparent shadow-none">
      <CardHeader>
        <CardDescription>What is your internship grade?</CardDescription>
      </CardHeader>
      <CardContent>
        <Select
          onValueChange={handleGradeChange}
          required
          disabled={disabledNoUserList.includes(authStatus)}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                _internshipGrade === 'initializing' ? 'Grade' : _internshipGrade
              }
            />
          </SelectTrigger>
          <SelectContent>
            {gradeScale.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default InternshipGrade;
