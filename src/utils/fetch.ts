import type { FetchHelperProps } from '@/lib/schema/fetchHelperProps';

import { z } from 'zod';

type ParamKey = z.infer<typeof paramKeyEnum>;

export const paramKeyEnum = z.enum(['userId', 'studentNumber', 'role']);
/** Returns -1 if the key doesn't exists in the keys. */
function paramToIndexOfKey<K extends ParamKey>(key: K, keys: K[]) {
  return keys.indexOf(key);
}

export default async function fetchHelper(props: FetchHelperProps) {
  const { method, route, data, params } = props;
  const signBeingFormdata = '{}';
  const headers = new Headers();

  if (props.headers !== undefined) {
    Object.entries(props.headers).forEach(([key, value]) => {
      console.log(key, value, ' in fetchHelper header.');
      headers.set(key, value);
    });
  }
  // ALL ABOUT URLS. //
  const origin = process.env.NEXT_PUBLIC_URL_ORIGIN;
  const baseURL = new URL(route, origin);
  let newURL = baseURL;

  // ALL ABOUT PARAMS //
  const searchParams = new URLSearchParams();
  const object = Object.entries(params ?? {});
  const keys = object.flatMap(([key]) => key as ParamKey);
  const values = object.flatMap(([, value]) => value);
  const userIdIndex = paramToIndexOfKey('userId', keys);
  const roleIndex = paramToIndexOfKey('role', keys);
  const studentNumberIndex = paramToIndexOfKey('studentNumber', keys);

  const fetchOptions = {
    method,
    headers,
  };

  switch (true) {
    case studentNumberIndex > -1:
      searchParams.append('studentNumber', values[studentNumberIndex]);
      break;
    case userIdIndex > -1:
      searchParams.append('userId', values[userIdIndex]);
      break;
    case roleIndex > -1:
      searchParams.append('role', values[roleIndex]);
      break;
  }

  newURL = new URL(`?${searchParams}`, baseURL);
  let stringifiedBody = '';

  switch (method) {
    case 'GET':
      return await fetch(newURL, fetchOptions);
    case 'POST':
    case 'PATCH':
      stringifiedBody = JSON.stringify(data!);
      return await fetch(baseURL, {
        ...fetchOptions,
        body:
          stringifiedBody === signBeingFormdata
            ? (data! as FormData)
            : stringifiedBody,
      });
  }
}
