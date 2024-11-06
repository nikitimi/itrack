'use client';

import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import useCertificateInputControl from '@/hooks/useCertificateInputControl';
import { Certificate } from '@/lib/enums/certificate';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';
import {
  certificateList,
  certificateRemove,
} from '@/redux/reducers/certificateReducer';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';
import { EMPTY_STRING } from '@/utils/constants';
import disabledWriteInDB from '@/utils/disabledWriteInDB';
import mime from '@/utils/mime';
import { ChangeEvent, useEffect, useState } from 'react';

type CertificateFile = {
  /** For referencing the file. */
  certificate: Certificate;
  file?: File;
};

/** Loads the certificates uploaded by the student from the database. */
const CertificateLoader = () => {
  // For Hydration.
  const [isCertificateLoaded, setCertificateState] = useState(false);
  const selector = useAppSelector((s) => s.certificate);
  const [state, setState] = useState<CertificateFile[]>([]);
  const _certificateList = certificateList(selector);
  const { isInputDisabled, certificateInputControl } =
    useCertificateInputControl();
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const dispatch = useAppDispatch();
  const invalidExtraCharactersRegex = /(%\d{1}\D{1})/g;

  function handleRemoveCertificate(certificate: Certificate) {
    if (disabledWriteInDB.includes(certificateInputControl))
      return alert('You cannot do that now.');

    const indexOfCertificate = state
      .flatMap((s) => s.certificate)
      .indexOf(certificate);

    if (indexOfCertificate === -1) {
      return alert(`Cannot remove the File of certificate: ${certificate}`);
    }

    dispatch(certificateRemove(certificate));
    let savePoint = false;
    setState((prevState) => {
      if (!savePoint) {
        const removedCertificate = prevState.splice(indexOfCertificate, 1);
        console.log({ removedCertificate });
        savePoint = true;
      }
      return prevState;
    });
  }

  function handleAddFile(
    event: ChangeEvent<HTMLInputElement>,
    certificate: Certificate
  ) {
    event.preventDefault();
    const input = event.currentTarget as HTMLInputElement;

    if (input.files === null) return alert('There is no PDF file added.');

    const choosedFile = input.files[0];
    const twoMB = 2000000;
    // 2 MB limit.
    if (choosedFile.size > twoMB)
      return alert("You've exceeded the file size limit: 2MB.");
    if (choosedFile.type !== mime.pdf)
      return alert('Please upload a valid PDF file.');

    setState((prevState) => {
      const indexOfCertificate = prevState
        .flatMap((s) => s.certificate)
        .indexOf(certificate);

      if (indexOfCertificate === -1) return prevState;

      const removedCertificate = prevState.splice(indexOfCertificate, 1)[0];

      return [...prevState, { ...removedCertificate, file: choosedFile }];
    });
  }
  // This will include all the certificate pushed in the certificateReducer.
  useEffect(
    () =>
      setState((prevState) => {
        const localCertificates = prevState.flatMap((s) => s.certificate);
        const lastPushCertificate =
          _certificateList[_certificateList.length - 1];

        if (lastPushCertificate === undefined) return prevState;

        if (!localCertificates.includes(lastPushCertificate)) {
          prevState.push({ certificate: lastPushCertificate });
          return prevState;
        }
        console.log('Certificate already exists on the list. line 107');
        return prevState;
      }),
    [_certificateList]
  );

  // For Hydration.
  useEffect(() => setCertificateState(true), []);
  if (!isCertificateLoaded) return <Loading />;

  console.log(state);

  return (
    <CardContent className="my-auto h-96 overflow-y-auto">
      <Table className="w-full border p-2">
        <TableHeader>
          <TableRow className="capitalize">
            <TableHead>certificate name</TableHead>
            <TableHead>actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="rounded-lg">
          {_certificateList.map((certificate) => {
            const encodedCertificate = encodeURIComponent(certificate).replace(
              invalidExtraCharactersRegex,
              EMPTY_STRING
            );

            return (
              <TableRow key={certificate} id={encodedCertificate}>
                <TableCell>
                  <p>{certificate.replace(/_/g, ' ')}</p>
                </TableCell>
                <TableCell>
                  <div
                    className={`${disabledWriteInDB.includes(certificateInputControl) ? 'opacity-0' : 'opacity-100'} flex justify-center gap-2 duration-200 ease-in-out`}
                  >
                    <Input
                      type="file"
                      disabled={
                        isInputDisabled ||
                        disabledNoUserList.includes(authStatus)
                      }
                      onChange={(e) => handleAddFile(e, certificate)}
                    />
                    <Button
                      variant="destructive"
                      disabled={
                        isInputDisabled ||
                        disabledNoUserList.includes(authStatus)
                      }
                      onClick={() => handleRemoveCertificate(certificate)}
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
  );
};

export default CertificateLoader;
