'use client';

import { type ChangeEvent, useEffect, useState } from 'react';

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
import mime from '@/utils/mime';
import constantNameFormatter from '@/utils/constantNameFormatter';
import fetchHelper from '@/utils/fetch';
import { UploadFileResult } from 'uploadthing/types';

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
  const { certificateInputControl } = useCertificateInputControl();
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const dispatch = useAppDispatch();
  const invalidExtraCharactersRegex = /(%\d{1}\D{1})/g;

  function handleRemoveCertificate(certificate: Certificate) {
    // if (disabledWriteInDB.includes(certificateInputControl))
    //   return alert('You cannot do that now.');

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

  useEffect(() => {
    if (certificateInputControl === 'submitted') {
      const fileToBlob = async (file: File) =>
        new Blob([new Uint8Array(await file.arrayBuffer())], {
          type: file.type,
        });
      const keys = state.map(async (certificate) => {
        const blob = await fileToBlob(certificate.file!);
        const formdata = new FormData();
        formdata.set('files', blob);
        const response = await fetchHelper({
          route: '/api/uploadthing/uploadFiles',
          method: 'POST',
          data: formdata,
        });
        const json = await response.json();

        if (!response.ok) {
          console.log('Upload failed');
          return json.errorMessage[0];
        }
        const result = json.data as UploadFileResult[];
        console.log(result);
        return result[0].data?.key;
      });
      console.log({ keys });
    }
  }, [certificateInputControl, state]);
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
            const encodedCertificate = encodeURIComponent(
              certificate.name
            ).replace(invalidExtraCharactersRegex, EMPTY_STRING);

            return (
              <TableRow key={certificate.name} id={encodedCertificate}>
                <TableCell>
                  <p className="capitalize">
                    {constantNameFormatter(certificate.name)}
                  </p>
                </TableCell>
                <TableCell>
                  <div
                    className={`flex justify-center gap-2 duration-200 ease-in-out`}
                  >
                    <Input
                      type="file"
                      disabled={disabledNoUserList.includes(authStatus)}
                      onChange={(e) => handleAddFile(e, certificate.name)}
                    />
                    <Button
                      variant="destructive"
                      disabled={disabledNoUserList.includes(authStatus)}
                      onClick={() => handleRemoveCertificate(certificate.name)}
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
