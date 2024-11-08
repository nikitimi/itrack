'server only';

import type { ClerkMiddlewareAuthObject } from '@clerk/nextjs/server';
import type {
  GetStudentNumber,
  GetStudentNumberResponse,
} from '@/server/lib/schema/apiResponse/getStudentNumber';

import { EMPTY_STRING } from '@/utils/constants';

export default async function setStudentNumber(
  clerkAuthMiddleware: ClerkMiddlewareAuthObject,
  origin: string
) {
  const userId = clerkAuthMiddleware.userId as string;
  const params = new URLSearchParams({
    userId,
  });
  const url = new URL(`/api/getStudentNumber?${params}`, origin);
  const response = await fetch(url, {
    method: 'GET',
  });
  const { data } = (await response.json()) as GetStudentNumberResponse;

  if (data.length > 0 && data[0] === 'string') {
    return {
      role: 'student',
      studentNumber: EMPTY_STRING,
      studentType: 'irregular',
      specialization: 'BUSINESS_ANALYTICS',
      firstName: EMPTY_STRING,
      lastName: EMPTY_STRING,
    } as GetStudentNumber;
  }

  return data[0] as GetStudentNumber;
}
