'use client';

import { type ChangeEvent, useEffect, useState } from 'react';

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
import {
  certificateAddFile,
  certificateList,
  certificateRemove,
} from '@/redux/reducers/certificateReducer';
import { EMPTY_STRING } from '@/utils/constants';
import mime from '@/utils/mime';
import constantNameFormatter from '@/utils/constantNameFormatter';
import Prompt from '@/components/Prompt';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';
import fetchHelper from '@/utils/fetch';
import { UploadFileResult } from 'uploadthing/types';
import { studentInfoNumber } from '@/redux/reducers/studentInfoReducer';
import { inputControlSetPromptType } from '@/redux/reducers/inputControlReducer';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';
import { DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { SidebarMenuSkeleton } from '@/components/ui/sidebar';
import Link from 'next/link';

type CertificateFile = {
  /** For referencing the file. */
  certificate: Certificate;
  file: File;
};

const initialDialogMessage = null;

/** Loads the certificates uploaded by the student from the database. */
const CertificateLoader = () => {
  const selector = useAppSelector((s) => s.certificate);
  const [state, setState] = useState<CertificateFile[]>([]);
  const [dialogMessage, setDialogMessage] = useState<null | string>(
    initialDialogMessage
  );
  const _certificateList = certificateList(selector);
  const { certificateInputControl } = useCertificateInputControl();
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const studentNumber = studentInfoNumber(useAppSelector((s) => s.studentInfo));
  const dispatch = useAppDispatch();
  const invalidExtraCharactersRegex = /(%\d{1}\D{1})/g;

  function handleRemoveCertificate(certificate: Certificate) {
    setDialogMessage('Attempting to delete certificate...');
    const indexOfCertificate = _certificateList
      .flatMap((c) => c.name)
      .indexOf(certificate);

    if (indexOfCertificate === -1) {
      return alert(`Cannot remove the File of certificate: ${certificate}`);
    }
    const uploadthingDeletePromise = new Promise((resolve, reject) =>
      fetchHelper({
        route: '/api/uploadthing/deleteFiles',
        method: 'POST',
        data: { name: _certificateList[indexOfCertificate].fileKey },
      }).then(async (response) => {
        const jsonResponse = await response.json();

        if (!response.ok) {
          reject(jsonResponse);
        }
        resolve(jsonResponse);
      })
    );
    const certificateMongoPromise = new Promise((resolve, reject) =>
      fetchHelper({
        route: '/api/mongo/certificate',
        method: 'PATCH',
        data: {
          certificateList: _certificateList.filter(
            (c) => c.name !== certificate
          ),
          studentNumber,
        },
      }).then(async (response) => {
        const jsonResponse = await response.json();

        if (!response.ok) {
          reject(jsonResponse);
        }
        resolve(jsonResponse);
      })
    );
    // Run all the promise at the same time.
    Promise.all([uploadthingDeletePromise, certificateMongoPromise])
      .finally(() => {
        setDialogMessage(
          `Successfully deleted ${constantNameFormatter(certificate, true)}`
        );
        dispatch(certificateRemove(certificate));
        setTimeout(() => setDialogMessage(initialDialogMessage), 2000);
      })
      .catch((e) => {
        setDialogMessage((e as Error).message);
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

      if (indexOfCertificate === -1) {
        return [...prevState, { certificate, file: choosedFile }];
      }

      const removedCertificate = prevState.splice(indexOfCertificate, 1)[0];

      return [...prevState, { ...removedCertificate, file: choosedFile }];
    });
  }
  // If the student press confirm in ceritifcate upload,
  // this side-effect will upload the file in the blob and
  // update the database.
  useEffect(() => {
    if (certificateInputControl === 'submitted') {
      setDialogMessage('Please wait for the PDF upload to finish');
      const fileToBlob = async (file: File) => {
        return new Blob([new Uint8Array(await file.arrayBuffer())], {
          type: file.type,
        });
      };
      const promises = state.map(
        (certificate) =>
          new Promise<
            | string
            | (Omit<CertificateFile, 'file'> & { key: string | undefined })
          >((resolve, reject) =>
            fileToBlob(certificate.file).then(async (blob) => {
              const formdata = new FormData();
              formdata.set('files', blob);
              const response = await fetchHelper({
                route: '/api/uploadthing/uploadFiles',
                method: 'POST',
                data: formdata,
                params: { fileName: certificate.file.name },
              });
              const json = await response.json();

              if (!response.ok) {
                reject(json.errorMessage[0]);
              }
              const result = json.data as UploadFileResult;
              resolve({
                certificate: certificate.certificate,
                key: result.data?.key,
              });
            })
          )
      );
      Promise.all(promises)
        .then((certificates) => {
          certificates.forEach(async (c) => {
            console.log('inside promise all', c);
            if (typeof c === 'string') return;
            const { certificate } = c;
            if (c.key === undefined) return;
            const filteredCertificateList = _certificateList.filter(
              (c) => c.name !== certificate
            );
            const newCertificateFile = { name: certificate, fileKey: c.key };

            const response = await fetchHelper({
              route: '/api/mongo/certificate',
              method: 'PATCH',
              data: {
                certificateList: [
                  ...filteredCertificateList,
                  newCertificateFile,
                ],
                studentNumber,
              },
            });
            dispatch(certificateAddFile(newCertificateFile));

            const jsonInResponse = await response.json();

            if (!response.ok) return alert(jsonInResponse);
          });
        })
        .finally(() => {
          setDialogMessage(`Successfully uploaded ${state.length} files.`);
          setState([]);
          dispatch(
            inputControlSetPromptType({
              key: 'certificateModule',
              promptType: 'fetched from server',
            })
          );
          setTimeout(() => setDialogMessage(initialDialogMessage), 2000);
        })
        .catch((e) => {
          setDialogMessage((e as Error).message);
          setTimeout(() => setDialogMessage(initialDialogMessage), 2000);
        });
    }
  }, [
    certificateInputControl,
    state,
    _certificateList,
    studentNumber,
    dispatch,
  ]);

  switch (authStatus) {
    case 'initializing':
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
              <SidebarMenuSkeleton />
              <SidebarMenuSkeleton />
              <SidebarMenuSkeleton />
              <SidebarMenuSkeleton />
            </TableBody>
          </Table>
        </CardContent>
      );
    case 'no user':
    case 'verifying account':
    case 'verifying new password':
      return <></>;
    case 'authenticated':
      return (
        <CardContent className="my-auto h-96 overflow-y-auto">
          <Dialog open={typeof dialogMessage === 'string'}>
            <DialogHeader>
              <DialogClose disabled className="opacity-0" />
              <DialogTrigger disabled={true}>
                <DialogTitle />
              </DialogTrigger>
            </DialogHeader>
            <DialogContent>
              <p>{dialogMessage}</p>
            </DialogContent>
          </Dialog>
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
                  <TableRow
                    key={certificate.name}
                    id={encodedCertificate}
                    className="w-screen"
                  >
                    <TableCell className="w-1/2">
                      {certificate.fileKey === EMPTY_STRING ? (
                        <p className="capitalize">
                          {constantNameFormatter(certificate.name)}
                        </p>
                      ) : (
                        <Link
                          target="_blank"
                          className="capitalize text-itrack-primary underline"
                          href={`https://utfs.io/f/${certificate.fileKey}`}
                        >
                          {constantNameFormatter(certificate.name)}
                        </Link>
                      )}
                    </TableCell>
                    <TableCell
                      className={`flex justify-end gap-2 duration-200 ease-in-out`}
                    >
                      <Input
                        type="file"
                        className="w-32"
                        disabled={disabledNoUserList.includes(authStatus)}
                        onChange={(e) => handleAddFile(e, certificate.name)}
                      />
                      <Prompt
                        handleConfirmation={() =>
                          handleRemoveCertificate(certificate.name)
                        }
                        title={`Remove ${constantNameFormatter(certificate.name, true)}?`}
                        description="Confirm certificate removal."
                        trigger={
                          <Button
                            className="w-32"
                            variant="destructive"
                            disabled={disabledNoUserList.includes(authStatus)}
                          >
                            Remove
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      );
  }
};

export default CertificateLoader;
