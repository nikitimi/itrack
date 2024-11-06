// type RegExpList = Record<string, RegExp | string>;

const regExp = {
  email:
    /^(([^<>()[\],;:\s@"]+(.[^<>()[\],;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/,
  /** TODO: Can be move to server for dynamic value.*/
  studentNumber: /(20)(\d{8})/,
  names: /([A-Z]+%2C )+([A-Za-z ]*[.]?)/,
} as const;

export default regExp;
