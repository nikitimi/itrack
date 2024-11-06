'use client';

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
import { useEffect, useState } from 'react';
import useCertificateInputControl from '@/hooks/useCertificateInputControl';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';

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
  const { isInputDisabled } = useCertificateInputControl();
  const condition =
    isCertificateOptionEmpty ||
    isInputDisabled ||
    disabledNoUserList.includes(authStatus);

  function handleClick() {
    try {
      if (isCertificateOptionEmpty)
        throw new Error('All certificates are now selected.');

      if (selectState === EMPTY_STRING) throw new Error('Select is null!');

      dispatch(certificateAdd(selectState as Certificate));
    } catch (e) {
      const error = e as Error;
      alert(error.message);
    }
  }

  useEffect(() => setCertificateLoad(true), []);

  return (
    <CardHeader>
      <CardTitle>Certificate Selector</CardTitle>
      <div className="grid grid-cols-2 gap-2">
        {isCertificateLoaded ? (
          <Select
            value={selectState}
            onValueChange={(v) => setSelectState(v)}
            disabled={condition}
            name="certificate"
          >
            <SelectTrigger>
              <SelectValue placeholder="Certificate" />
            </SelectTrigger>
            <SelectContent>
              {certificateEnum.options
                .filter((c) => !_certificateList.includes(c))
                .map((certificate) => {
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
        ) : (
          <Select disabled={true} name="certificate">
            <SelectTrigger>
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
