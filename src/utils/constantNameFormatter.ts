import { EMPTY_STRING } from './constants';

const lowerCasedAbbre = [
  'ui',
  'ux',
  'it',
  'erp',
  'ai',
  'cms',
  'uat',
  'cmdb',
  'sla',
];
/** Constant name referes to Screaming snakecase e.g. HELLO_WORLD. */
export default function constantNameFormatter(constantName: string | null) {
  let textHolder = String(constantName ?? EMPTY_STRING)
    .toLocaleLowerCase()
    .replace(/_/g, ' ');
  lowerCasedAbbre.forEach(
    (abbre) =>
      (textHolder = textHolder.replace(
        new RegExp(`(?<=)(${abbre})(,*)(?=\\s)`, 'g'),
        abbre.toLocaleUpperCase()
      ))
  );
  return textHolder;
}
