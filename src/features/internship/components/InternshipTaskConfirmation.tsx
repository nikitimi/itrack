'use client';

import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  internshipCompanyQuestion,
  internshipGrade,
  internshipTasks,
} from '@/redux/reducers/internshipReducer';
import type { InternshipResult } from '@/utils/types/internshipResult';
import fetchHelper from '@/utils/fetch';
import { studentInfoNumber } from '@/redux/reducers/studentInfoReducer';
import { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import { InternshipTask } from '@/lib/enums/internshipTask';
import { Button } from '@/components/ui/button';
import useInternshipInputControl from '@/hooks/useInternshipInputControl';
import disabledWriteInDB from '@/utils/disabledWriteInDB';
import { inputControlSetPromptType } from '@/redux/reducers/inputControlReducer';
import Prompt from '@/components/Prompt';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';

const InternshipTaskConfirmation = () => {
  const [isTaskAlertPrompted, setTaskAlertPromp] = useState(false);
  const dispatch = useAppDispatch();
  const selector = useAppSelector((s) => s.internship);
  const _internshipCompanyQuestion = internshipCompanyQuestion(selector);
  const _internshipGrade = internshipGrade(selector);
  const _internshipTasks = internshipTasks(selector);
  const { internshipInputControl } = useInternshipInputControl();
  const studentNumber = studentInfoNumber(useAppSelector((s) => s.studentInfo));
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );

  async function handleInternshipSubmit() {
    dispatch(
      inputControlSetPromptType({
        key: 'internshipModule',
        promptType: 'fetching',
      })
    );
    try {
      if (disabledWriteInDB.includes(internshipInputControl)) {
        const response = await fetch('/api/mongo/internship', {
          method: 'PATCH',
          body: JSON.stringify({
            tasks: _internshipTasks,
            isITCompany: _internshipCompanyQuestion,
            grade: _internshipGrade,
            studentNumber,
          }),
        });

        const json = (await response.json()) as BaseAPIResponse<string>;
        if (!response.ok) throw new Error(json.errorMessage[0]);

        dispatch(
          inputControlSetPromptType({
            key: 'internshipModule',
            promptType: 'submitted',
          })
        );

        return console.log(json.data);
      }
      // Check if already submitted  document.
      const getInternship = await fetchHelper('/api/mongo/internship', 'GET', {
        studentNumber,
      });
      const { errorMessage } = (await getInternship.json()) as BaseAPIResponse<
        Omit<InternshipTask, 'status'>
      >;
      // Data exists.
      if (errorMessage.length === 0) {
        throw new Error("You've already posted your internship details.");
      }

      if (_internshipCompanyQuestion === 'initializing') {
        throw new Error(
          'You forgot to answer whether your internship is from a IT Company or not.'
        );
      }
      if (_internshipGrade === 'initializing') {
        throw new Error('You forgot to input your internship grade.');
      }
      if (_internshipTasks.length === 0 && !isTaskAlertPrompted) {
        setTaskAlertPromp(true);
        throw new Error(
          "Are you sure you didn't performed any task during internship?\nPress submit again to confirm."
        );
      }

      const result: Omit<InternshipResult, 'status'> = {
        tasks: _internshipTasks,
        isITCompany: _internshipCompanyQuestion,
        grade: _internshipGrade,
      };

      const response = await fetchHelper('/api/mongo/internship', 'POST', {
        ...result,
        studentNumber,
      });
      const json = (await response.json()) as BaseAPIResponse<string>;

      if (!response.ok) throw new Error(json.errorMessage[0]);

      dispatch(
        inputControlSetPromptType({
          key: 'internshipModule',
          promptType: 'submitted',
        })
      );
    } catch (e) {
      dispatch(
        inputControlSetPromptType({
          key: 'internshipModule',
          promptType: 'no document',
        })
      );
      const error = e as Error;
      alert(error.message);
    }
  }

  return (
    <Prompt
      description={
        "Are you sure you've entered all the details during your internship?"
      }
      promptKey={'certificateModule'}
      title={'Internship Details Confirmation'}
      trigger={
        <Button
          className="mx-2 w-full"
          disabled={disabledNoUserList.includes(authStatus)}
        >
          Submit internship details
        </Button>
      }
      handleConfirmation={handleInternshipSubmit}
    />
  );
};

export default InternshipTaskConfirmation;
