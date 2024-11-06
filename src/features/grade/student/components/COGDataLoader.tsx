'use client';

import type GradeInfo from '@/utils/types/gradeInfo';

import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@/hooks/redux';
import { grades } from '@/redux/reducers/gradeReducer';
import Loading from '@/components/Loading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';

type SortingConfig = {
  key: keyof GradeInfo;
  direction: 'ascending' | 'descending';
};

const COGDataLoader = () => {
  const _grades = grades(useAppSelector((s) => s.grade));
  // Handle hydration failure.
  const [state, setState] = useState(false);
  const [isOpen, setIsOpen] = useState<string[]>([]);
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const [sortConfig, setSortConfig] = useState<SortingConfig | null>(null);
  const globalUnderscoreRegex = /_/g;
  const SPACE_STRING = ' ';
  const addSubjectTDClasses: string[] = [];
  const hideSubjectTDClasses = ['h-0', 'select-none'];

  const sortedGrades = React.useMemo(() => {
    const sortableGrades = [..._grades];
    if (sortConfig !== null) {
      console.log({ sortConfig });
      sortableGrades.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableGrades;
  }, [_grades, sortConfig]);

  const requestSort = (key: SortingConfig['key']) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  function initializeSubjectTDClasses(arrayOfClasses: string[]) {
    const baseClasses = 'duration-200 ease-out';
    const convertedClasses = arrayOfClasses
      .toLocaleString()
      .replace(/,/g, SPACE_STRING);

    return `${baseClasses} ${convertedClasses}`;
  }

  function toggleSubject(
    event: React.MouseEvent<HTMLButtonElement>,
    identifier: string
  ) {
    try {
      event.preventDefault();
      const button = event.currentTarget as HTMLButtonElement;
      const tr = document.querySelector(
        `td#${identifier}`
      ) as HTMLTableRowElement | null;

      if (tr === null)
        throw new Error(`Subjects table elements ${identifier} is empty!`);

      // Styling the table toggle.
      addSubjectTDClasses.forEach((styleClass) =>
        tr.classList.toggle(styleClass)
      );
      hideSubjectTDClasses.forEach((styleClass) =>
        tr.classList.toggle(styleClass)
      );
      const isShowing = button.textContent === 'show';
      button.textContent = isShowing ? 'collapse' : 'show';
      button.setAttribute('aria-expanded', JSON.stringify(isShowing));
      if (isOpen.includes(identifier)) {
        return setIsOpen(isOpen.filter((v) => v !== identifier));
      }
      setIsOpen((s) => [...s, identifier]);
    } catch (e) {
      const error = e as Error;
      console.log(error.message);
    }
  }

  useEffect(() => setState(true), []);

  if (state) {
    return (
      <Table className="p-2">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                disabled={disabledNoUserList.includes(authStatus)}
                variant="ghost"
                onClick={() => requestSort('yearLevel')}
              >
                Year Level
              </Button>
            </TableHead>
            <TableHead>
              <Button
                disabled={disabledNoUserList.includes(authStatus)}
                variant="ghost"
                onClick={() => requestSort('academicYear')}
              >
                Academic Year
              </Button>
            </TableHead>
            <TableHead>
              <Button
                disabled={disabledNoUserList.includes(authStatus)}
                variant="ghost"
                onClick={() => requestSort('semester')}
              >
                Semester
              </Button>
            </TableHead>
            <TableHead>Subjects</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedGrades.map((gradeInfo) => {
            const { academicYear, yearLevel, semester, subjects } = gradeInfo;
            const identifier = `${yearLevel}-${semester}`;

            return (
              <TableRow
                key={identifier}
                className="relative h-12 odd:bg-slate-50"
                // className="relative flex w-full items-start justify-between text-black odd:bg-slate-100"
              >
                <TableCell>
                  {yearLevel.replace(globalUnderscoreRegex, SPACE_STRING)}
                </TableCell>
                <TableCell>{academicYear}</TableCell>
                <TableCell>
                  {semester.replace(globalUnderscoreRegex, SPACE_STRING)}
                </TableCell>
                <TableCell
                  id={identifier}
                  className={initializeSubjectTDClasses(hideSubjectTDClasses)}
                >
                  <Collapsible open={isOpen.includes(identifier)}>
                    <CollapsibleContent>
                      {subjects.map((subject) => {
                        const { code, grade } = subject;
                        return (
                          <Card
                            key={code}
                            className="flex items-center justify-between rounded-none border-none bg-transparent py-1 shadow-none"
                          >
                            <CardTitle>
                              {code.replace(
                                globalUnderscoreRegex,
                                SPACE_STRING
                              )}
                            </CardTitle>
                            <CardDescription>{grade}</CardDescription>
                          </Card>
                        );
                      })}
                    </CollapsibleContent>
                    <CollapsibleTrigger asChild>
                      <Button
                        disabled={disabledNoUserList.includes(authStatus)}
                        aria-expanded="false"
                        className="w-24 rounded-lg bg-blue-500 px-2 py-1 capitalize text-white shadow-sm duration-200 ease-in"
                        onClick={(e) => toggleSubject(e, identifier)}
                      >
                        show
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
  return <Loading />;
};

export default COGDataLoader;
