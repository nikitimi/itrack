'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { type InternshipTask } from '@/lib/enums/internshipTask';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';
import {
  internshipTaskRemove,
  internshipTasks,
} from '@/redux/reducers/internshipReducer';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';
import constantNameFormatter from '@/utils/constantNameFormatter';
import { EMPTY_STRING } from '@/utils/constants';

const InternshipTaskLoader = () => {
  const selector = useAppSelector((s) => s.internship);
  const _internshipTasks = internshipTasks(selector);
  const dispatch = useAppDispatch();
  const nonAlphabetCharacters = /[()/]/g;
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );

  function handleRemoveTask(task: InternshipTask) {
    const tableRow = document.querySelector(
      `tr#${task.replace(nonAlphabetCharacters, EMPTY_STRING)}`
    ) as HTMLTableRowElement;
    const toggleClasses = ['hidden'] as const;

    // if (disabledWriteInDB.includes(internshipInputControl)) {
    //   return alert("You've already submitted your internship form.");
    // }

    tableRow.classList.toggle(...toggleClasses);
    dispatch(internshipTaskRemove(task));
  }

  return (
    <Card className="rounded-none border-none bg-transparent shadow-none">
      <CardHeader>
        <CardDescription>List of performed internship tasks</CardDescription>
      </CardHeader>
      <CardContent className="h-48 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-center">
              <TableHead>Task name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {_internshipTasks.map((task) => {
              const taskName = task.replace(/_/g, ' ');
              return (
                <TableRow
                  key={task}
                  id={task.replace(nonAlphabetCharacters, EMPTY_STRING)}
                >
                  <TableCell className="capitalize text-foreground">
                    <p>{constantNameFormatter(taskName)}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row justify-center gap-2 p-2">
                      <Button
                        disabled={disabledNoUserList.includes(authStatus)}
                        onClick={() => handleRemoveTask(task)}
                        variant="destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InternshipTaskLoader;
