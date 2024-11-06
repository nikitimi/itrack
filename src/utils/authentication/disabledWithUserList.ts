import type { AuthenticationStatus } from '@/lib/enums/authenticationStatus';

const disabledWithUserList: AuthenticationStatus[] = [
  'initializing',
  'authenticated',
];

export default disabledWithUserList;
