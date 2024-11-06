import { NextResponse } from 'next/server';

import layoutFetcher from '@/server/layoutFetcher';
import { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import { EMPTY_STRING } from '@/utils/constants';

export async function GET() {
  const response: BaseAPIResponse<Awaited<ReturnType<typeof layoutFetcher>>> = {
    data: {
      grades: [],
      certificate: [],
      internship: undefined,
      role: 'student',
      firstName: EMPTY_STRING,
      lastName: EMPTY_STRING,
      specialization: 'BUSINESS_ANALYTICS',
      studentNumber: EMPTY_STRING,
      chartData: [],
    },
    errorMessage: [],
  };
  try {
    const result = await layoutFetcher();
    return NextResponse.json({ ...response, data: result });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json(
      { ...response, errorMessage: [error.message] },
      { status: 400 }
    );
  }
}
