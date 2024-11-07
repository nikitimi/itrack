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
export default function constantNameFormatter(constantName: string) {
  let textHolder = constantName.toLocaleLowerCase().replace(/_/g, ' ');
  lowerCasedAbbre.forEach(
    (abbre) =>
      (textHolder = textHolder.replace(
        new RegExp(`(?<=)(${abbre})(,*)(?=\\s)`, 'g'),
        abbre.toLocaleUpperCase()
      ))
  );
  return textHolder;
}
