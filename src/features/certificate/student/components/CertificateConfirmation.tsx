'use client';

import type { CertificateResult } from '@/utils/types/certificateResult';

import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  certificateList,
  certificateModuleCompleted,
  certificateModuleStateUpdate,
} from '@/redux/reducers/certificateReducer';
import { studentInfoNumber } from '@/redux/reducers/studentInfoReducer';
import { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import fetchHelper from '@/utils/fetch';

type InitialState = {
  status: 'empty certificate not triggered' | 'empty certificate triggered';
};

const initialState: InitialState = {
  status: 'empty certificate not triggered',
};

const CertificateConfirmation = () => {
  const [state, setState] = useState(initialState);
  const selector = useAppSelector((s) => s.certificate);
  const _certificateList = certificateList(selector);
  const isCertificateCompleted = certificateModuleCompleted(selector);

  const dispatch = useAppDispatch();
  const studentNumber = studentInfoNumber(useAppSelector((s) => s.studentInfo));
  const isCertificateListEmpty = _certificateList.length === 0;

  async function handleSubmit() {
    try {
      if (isCertificateCompleted)
        throw new Error("You've already uploaded your certificates.");

      if (
        isCertificateListEmpty &&
        state.status === 'empty certificate not triggered'
      )
        throw new Error("Are you sure you didn't take any certificates?");

      const result: Pick<CertificateResult, 'certificateList'> = {
        certificateList: _certificateList,
      };

      // Posting to database.
      const postingCertificate = await fetchHelper(
        '/api/mongo/certificate',
        'POST',
        {
          ...result,
          studentNumber,
        }
      );

      const responseBody = await postingCertificate.json();

      if (!postingCertificate.ok) {
        throw new Error(
          (responseBody as BaseAPIResponse<string>).errorMessage[0]
        );
      }

      // TODO: Make UI to present this.
      console.log(responseBody);
      dispatch(certificateModuleStateUpdate(true));
    } catch (e) {
      setState((prevState) => ({
        ...prevState,
        status: 'empty certificate triggered',
      }));
      const error = e as Error;
      alert(error.message);
    }
  }
  return (
    <div className="w-full bg-violet-500 p-2">
      <div className="grid">
        <button
          className="h-12 rounded-lg bg-background px-2 py-1 text-foreground shadow-sm duration-300 ease-in-out hover:bg-green-600"
          disabled={isCertificateCompleted}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CertificateConfirmation;
