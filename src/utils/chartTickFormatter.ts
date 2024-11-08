import { EMPTY_STRING } from '@/utils/constants';

export default function chartTickFormatter<T>(value: T) {
  const initials = `${value}`
    .split('_')
    .map((s) => s.charAt(0))
    .toString()
    .replace(/,/g, EMPTY_STRING);
  return initials;
}
