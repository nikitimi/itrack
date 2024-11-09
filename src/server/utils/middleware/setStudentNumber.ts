'server only';

import type { ClerkMiddlewareAuthObject } from '@clerk/nextjs/server';
import type {
  GetStudentNumber,
  GetStudentNumberResponse,
} from '@/server/lib/schema/apiResponse/getStudentNumber';

import fetchHelper from '@/utils/fetch';

export default async function setStudentNumber(
  clerkAuthMiddleware: ClerkMiddlewareAuthObject
) {
  const userId = clerkAuthMiddleware.userId as string;
  const studentNumberResponse = await fetchHelper({
    route: '/api/getStudentNumber',
    method: 'GET',
    params: { userId },
  });
  const { data, errorMessage } =
    (await studentNumberResponse.json()) as GetStudentNumberResponse;

  if (!studentNumberResponse.ok) {
    return errorMessage[0];
  }

  return data[0] as GetStudentNumber;
}
