'use client';

import type { ChangeEvent } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import fetchHelper from '@/utils/fetch';
import { ExtractPDFDataCORResponse } from '@/server/lib/schema/apiResponse/extractPDFDataCOR';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  studentTemporarySetFirstname,
  studentTemporarySetLastname,
  studentTemporarySetMiddleInitial,
  studentTemporarySetNumber,
} from '@/redux/reducers/studentTemporaryReducer';
import { EMPTY_STRING } from '@/utils/constants';
import disabledWithUserList from '@/utils/authentication/disabledWithUserList';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';

const CORExtractor = () => {
  const dispatch = useAppDispatch();
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );

  async function handleSubmit(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const fileList = event.currentTarget.files;

    if (fileList === null) return alert('Please upload your COR file here.');

    const formdata = new FormData();
    formdata.append('file', fileList[0]);
    const response = await fetchHelper(
      '/api/extractPDFData/COR',
      'POST',
      { studentNumber: undefined },
      formdata
    );
    const json = (await response.json()) as ExtractPDFDataCORResponse;

    if (!response.ok) return alert(json.errorMessage[0]);

    const { data } = json;
    const splittedName = data.name.split(' ');
    const commonMiddleInitialMaxLength = 2;

    const fullName = {
      firstName: EMPTY_STRING,
      lastName: EMPTY_STRING,
      middleInitial: EMPTY_STRING,
    };

    splittedName.forEach((nameFragment, index) => {
      const isLastName = index === 0;
      const isMiddleInitial =
        index === splittedName.length - 1 &&
        nameFragment.length <= commonMiddleInitialMaxLength;
      const cleanedNameFragment = nameFragment
        .replace(',', EMPTY_STRING)
        .toLocaleLowerCase();

      switch (true) {
        case isLastName:
          fullName.lastName = cleanedNameFragment;
          break;
        case isMiddleInitial:
          fullName.middleInitial = cleanedNameFragment;
          break;
        default:
          fullName.firstName += ` ${cleanedNameFragment}`;
          break;
      }
    });

    dispatch(studentTemporarySetNumber(data.studentNumber));
    dispatch(studentTemporarySetMiddleInitial(fullName.middleInitial));
    dispatch(studentTemporarySetFirstname(fullName.firstName));
    dispatch(studentTemporarySetLastname(fullName.lastName));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>COR Extractor</CardTitle>
        <CardDescription>
          Upload a PDF file of your COR for verification.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          type="file"
          onChange={handleSubmit}
          required
          disabled={disabledWithUserList.includes(authStatus)}
        />
      </CardContent>
    </Card>
  );
};

export default CORExtractor;
