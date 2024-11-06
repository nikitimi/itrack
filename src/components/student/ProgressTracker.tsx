'use client';

import { useEffect } from 'react';

import { Progress } from '@/components/ui/progress';
import {
  certificateModuleInputControl,
  gradeModuleInputControl,
  internshipModuleInputControl,
} from '@/redux/reducers/inputControlReducer';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import disabledWriteInDB from '@/utils/disabledWriteInDB';
import { NUMBER_OF_SEMESTER } from '@/utils/constants';
import { grades } from '@/redux/reducers/gradeReducer';
import {
  presentationCompletion,
  presentationCompletionUpdate,
  presentationCompletionUpdateWithMissingGrades,
} from '@/redux/reducers/presentationReducer';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Button } from '../ui/button';
import useAppRouter from '@/hooks/useAppRouter';

export function ProgressTracker() {
  const _grades = grades(useAppSelector((s) => s.grade));
  const dispatch = useAppDispatch();
  const completedList = ['grade', 'internship', 'certificate'] as const;
  const inputControlSelector = useAppSelector((s) => s.inputControl);
  const gInputControl = gradeModuleInputControl(inputControlSelector);
  const iInputControl = internshipModuleInputControl(inputControlSelector);
  const cInputControl = certificateModuleInputControl(inputControlSelector);
  const timeoutDuration = 100;
  const completion = presentationCompletion(
    useAppSelector((s) => s.presentation)
  );
  const router = useAppRouter();

  function getProgress() {
    const completionHolder = completion.filter((l) => !l.startsWith('grade'));

    if (completionHolder.length < completedList.length) {
      const gradeItem = completion.filter((l) => l.startsWith('grade'));
      const gradePercentage =
        gradeItem.length === 0 ? '0' : gradeItem[0].split(' ')[1];
      const parsedPercentage = parseInt(gradePercentage, 10);
      const finalProgress =
        (completionHolder.length / completedList.length) * 100 +
        (isNaN(parsedPercentage) ? 33.33 : parsedPercentage);

      return Math.round(finalProgress);
    }
    return 100;
  }

  function getProgressColor() {
    const progress = getProgress();
    switch (true) {
      case progress <= 25:
        return 'bg-red-500';
      case progress <= 60:
        return 'bg-yellow-300';
      case progress <= 70:
        return 'bg-yellow-400';
      case progress <= 80:
        return 'bg-yellow-500';
      case progress <= 90:
        return 'bg-green-300';
      default:
        return 'bg-green-400';
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (disabledWriteInDB.includes(gInputControl)) {
        dispatch(presentationCompletionUpdateWithMissingGrades('grade'));
      }
      const gradePercentage = (_grades.length / NUMBER_OF_SEMESTER) * 100 * 0.3;
      const identifierName =
        gradePercentage === 30
          ? 'grade'
          : `grade ${gradePercentage.toFixed(0)}`;
      dispatch(presentationCompletionUpdateWithMissingGrades(identifierName));
    }, timeoutDuration);

    return () => clearTimeout(timer);
  }, [gInputControl, timeoutDuration, _grades, dispatch]);

  useEffect(() => {
    if (!disabledWriteInDB.includes(iInputControl)) return;
    const timer = setTimeout(() => {
      dispatch(presentationCompletionUpdate('internship'));
    }, timeoutDuration);
    return () => clearTimeout(timer);
  }, [iInputControl, timeoutDuration, dispatch]);

  useEffect(() => {
    if (!disabledWriteInDB.includes(cInputControl)) return;
    const timer = setTimeout(() => {
      dispatch(presentationCompletionUpdate('certificate'));
    }, timeoutDuration);
    return () => clearTimeout(timer);
  }, [cInputControl, timeoutDuration, dispatch]);

  return (
    <>
      <div className="flex h-6 items-center justify-between px-4 text-center">
        {(completion as unknown as typeof completedList).map((v) => (
          <TooltipProvider key={v}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="link"
                  onClick={() =>
                    router.push(
                      `/student/modules/${v.split(' ')[0] as (typeof completedList)[number]}`
                    )
                  }
                  className={`${completedList.includes(v) ? 'text-green-400' : 'text-yellow-400'} capitalize`}
                >
                  {v.split(' ')[0]}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {completedList.includes(v)
                  ? `You've completed ${v} module.`
                  : `You're missing ${NUMBER_OF_SEMESTER - _grades.length} COG(s).`}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      <Progress
        value={getProgress()}
        className="h-2 w-full"
        color={getProgressColor()}
      />
    </>
  );
}
