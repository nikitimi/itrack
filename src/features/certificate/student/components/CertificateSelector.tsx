'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import certificateEnum, { type Certificate } from '@/lib/enums/certificate';
import {
  certificateAdd,
  certificateList,
} from '@/redux/reducers/certificateReducer';
import { EMPTY_STRING } from '@/utils/constants';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';
import constantNameFormatter from '@/utils/constantNameFormatter';

/** The uploader of certificates to the database. */
const CertificateSelector = () => {
  const allUnderscoreRegExp = /_/g;
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const selector = useAppSelector((s) => s.certificate);
  const _certificateList = certificateList(selector);
  const isCertificateOptionEmpty =
    _certificateList.length === certificateEnum.options.length;
  const [isCertificateLoaded, setCertificateLoad] = useState(false);
  const dispatch = useAppDispatch();
  const [selectState, setSelectState] = useState<string>('');
  const condition =
    isCertificateOptionEmpty || disabledNoUserList.includes(authStatus);

  function handleClick() {
    try {
      if (isCertificateOptionEmpty)
        throw new Error('All certificates are now selected.');

      if (selectState === EMPTY_STRING) throw new Error('Select is null!');

      dispatch(
        certificateAdd({
          name: selectState as Certificate,
          fileKey: EMPTY_STRING,
        })
      );
    } catch (e) {
      const error = e as Error;
      alert(error.message);
    }
  }

  useEffect(() => setCertificateLoad(true), []);

  return (
    <CardHeader>
      <CardTitle>Select certificate type.</CardTitle>
      <div className="mx-auto grid w-1/2 grid-cols-2 gap-2">
        {isCertificateLoaded ? (
          <Select
            value={selectState}
            onValueChange={(v) => setSelectState(v)}
            disabled={condition}
            name="certificate"
          >
            <SelectTrigger className="capitalize">
              <SelectValue placeholder="Certificate" />
            </SelectTrigger>
            <SelectContent>
              {certificateEnum.options
                .filter(
                  (c) =>
                    !_certificateList.flatMap((list) => list.name).includes(c)
                )
                .map((certificate) => {
                  return (
                    <SelectItem
                      key={certificate}
                      value={certificate}
                      className="capitalize text-black"
                    >
                      {constantNameFormatter(certificate)}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        ) : (
          <Select disabled={true} name="certificate">
            <SelectTrigger className="capitalize">
              <SelectValue placeholder="Certificate" />
            </SelectTrigger>
            <SelectContent>
              {certificateEnum.options.map((certificate) => {
                const formattedCertificate = certificate.replace(
                  allUnderscoreRegExp,
                  ' '
                );

                return (
                  <SelectItem
                    key={certificate}
                    value={certificate}
                    className="text-black"
                  >
                    {formattedCertificate}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
        <Button disabled={condition} onClick={handleClick}>
          Add Certificate
        </Button>
      </div>
    </CardHeader>
  );
};

export default CertificateSelector;
