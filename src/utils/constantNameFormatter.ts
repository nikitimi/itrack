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
export default function constantNameFormatter(
  constantName: string | null,
  unsupportedClass?: boolean
) {
  let textHolder = String(constantName ?? EMPTY_STRING);

  if (unsupportedClass === true) {
    return textHolder
      .split('_')
      .map((v) => `${v.charAt(0)}${v.slice(1, v.length).toLocaleLowerCase()}`)
      .toString()
      .replace(/,/g, ' ');
  }

  textHolder = textHolder.toLocaleLowerCase().replace(/_/g, ' ');
  lowerCasedAbbre.forEach(
    (abbre) =>
      (textHolder = textHolder.replace(
        new RegExp(`(?<=)(${abbre})(,*)(?=\\s)`, 'g'),
        abbre.toLocaleUpperCase()
      ))
  );
  return textHolder;
}
