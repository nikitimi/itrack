'use client';

import type { CertificateResult } from '@/utils/types/certificateResult';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { certificateList } from '@/redux/reducers/certificateReducer';
import { studentInfoNumber } from '@/redux/reducers/studentInfoReducer';
import { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import fetchHelper from '@/utils/fetch';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { inputControlSetPromptType } from '@/redux/reducers/inputControlReducer';
import { PromptType } from '@/lib/enums/promptType';
import useCertificateInputControl from '@/hooks/useCertificateInputControl';
import Prompt from '@/components/Prompt';
import disabledWriteInDB from '@/utils/disabledWriteInDB';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';

const CertificateConfirmation = () => {
  const certificateSelector = useAppSelector((s) => s.certificate);
  const _certificateList = certificateList(certificateSelector);
  const studentNumber = studentInfoNumber(useAppSelector((s) => s.studentInfo));
  const { certificateInputControl } = useCertificateInputControl();
  const dispatch = useAppDispatch();
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );

  function handleInputControl(prompType: PromptType) {
    dispatch(
      inputControlSetPromptType({
        key: 'certificateModule',
        promptType: prompType,
      })
    );
  }

  function handleSubmit() {
    if (certificateInputControl === 'no document') {
      handleInputControl('showing prompt');
    }
  }

  async function handleConfirmCertificate() {
    handleInputControl('submitted');

    const result: Pick<CertificateResult, 'certificateList'> = {
      certificateList: _certificateList,
    };

    if (disabledWriteInDB.includes(certificateInputControl)) {
      const response = await fetch('/api/mongo/certificate', {
        method: 'PATCH',
        body: JSON.stringify({ ...result, studentNumber }),
      });

      const json = (await response.json()) as BaseAPIResponse<string>;
      if (!response.ok) return alert(json.errorMessage[0]);

      console.log(json.data);

      return dispatch(
        inputControlSetPromptType({
          key: 'certificateModule',
          promptType: 'submitted',
        })
      );
    }

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
      return alert((responseBody as BaseAPIResponse<string>).errorMessage[0]);
    }
    dispatch(
      inputControlSetPromptType({
        key: 'certificateModule',
        promptType: 'submitted',
      })
    );
  }

  return (
    <>
      <CardFooter className="relative z-10 grid">
        <Prompt
          promptKey="certificateModule"
          description={"Are you sure about the details you've provided?"}
          title={'Certificate Confirmation'}
          handleConfirmation={handleConfirmCertificate}
          trigger={
            <Button
              onClick={handleSubmit}
              disabled={disabledNoUserList.includes(authStatus)}
            >
              Submit
            </Button>
          }
        />
      </CardFooter>
    </>
  );
};

export default CertificateConfirmation;
