import { EMPTY_STRING } from './constants';

export default function chartTickFormatter(value: any) {
  const initials = `${value}`
    .split('_')
    .map((s) => s.charAt(0))
    .toString()
    .replace(/,/g, EMPTY_STRING);
  return initials;
}
