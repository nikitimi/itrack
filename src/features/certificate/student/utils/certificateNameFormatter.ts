import type { Certificate } from '@/lib/enums/certificate';
import { EMPTY_STRING } from '@/utils/constants';

const lowerCasedAbbre = ['ui', 'ux', 'it', 'ai'];

export default function certificateNameFormatter(certificate: Certificate) {
  let textHolder = EMPTY_STRING;
  lowerCasedAbbre.forEach(
    (abbre) =>
      (textHolder = certificate
        .toLocaleLowerCase()
        .replace(/_/g, ' ')
        .replace(abbre, abbre.toLocaleUpperCase()))
  );
  return textHolder;
}
