import type { AuthenticationStatus } from '@/lib/enums/authenticationStatus';

const disabledNoUserList: AuthenticationStatus[] = [
  'initializing',
  'no user',
  'verifying account',
  'verifying new password',
];

export default disabledNoUserList;
