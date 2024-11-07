'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import type { InternshipTask } from '@/lib/enums/internshipTask';
import internshipTaskEnum from '@/lib/enums/internshipTask';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';
import {
  internshipTaskAdd,
  internshipTasks,
} from '@/redux/reducers/internshipReducer';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';
import constantNameFormatter from '@/utils/constantNameFormatter';
import { SelectValue } from '@radix-ui/react-select';
import { FormEvent } from 'react';

const InternshipTaskSelector = () => {
  const dispatch = useAppDispatch();
  const selector = useAppSelector((s) => s.internship);
  const _internshipTasks = internshipTasks(selector);
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const condition =
    _internshipTasks.length === internshipTaskEnum.options.length ||
    disabledNoUserList.includes(authStatus);

  function handleTaskAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formdata = new FormData(event.currentTarget);
      const selectedTask = formdata.get('selectedTask') as InternshipTask;

      if (_internshipTasks.includes(selectedTask)) {
        throw new Error(`${selectedTask.replace(/_/g, ' ')} already exists`);
      }

      if (!internshipTaskEnum.options.includes(selectedTask)) return;

      dispatch(internshipTaskAdd(selectedTask));
    } catch (e) {
      const error = e as Error;
      alert(error.message);
    }
  }

  return (
    <Card className="rounded-none border-none bg-transparent shadow-none">
      <form onSubmit={handleTaskAdd}>
        <CardHeader>
          <CardDescription>Internship Task Selector</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <Select name="selectedTask" disabled={condition}>
            <SelectTrigger>
              <SelectValue placeholder="Internship Tasks" />
            </SelectTrigger>
            <SelectContent>
              {internshipTaskEnum.options
                .filter((task) => !_internshipTasks.includes(task))
                .map((task) => {
                  const taskName = task.replace(/_/g, ' ');
                  return (
                    <SelectItem key={task} value={task} className="capitalize">
                      {constantNameFormatter(taskName)}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
          <Button variant="outline" type="submit" disabled={condition}>
            Add Task
          </Button>
        </CardContent>
      </form>
    </Card>
  );
};

export default InternshipTaskSelector;
