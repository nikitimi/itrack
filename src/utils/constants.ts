/** These are the keys passed in the NextJS's middleware as identifier in the request headers. */
export const HEADER_KEY = {
  origin: 'x-origin',
  pathname: 'x-pathname',
  role: 'x-role',
  firstName: 'x-firstName',
  middleInitial: 'x-middleInitial',
  lastName: 'x-lastName',
  specialization: 'x-specialization',
  studentNumber: 'x-studentNumber',
  userId: 'x-uid',
  url: 'x-url',
} as const;
/** URL consists of '/'. */
export const ROUTE_DIVIDER = '/' as const;
/** Default route of the app. */
export const ABOUT_ROUTE = `${ROUTE_DIVIDER}` as const;

// The following will be used for setting state that needs to be the same type but is invalid.
export const EMPTY_STRING = '';
export const WRONG_NUMBER = -1;
export const NUMBER_OF_SEMESTER = 6;
