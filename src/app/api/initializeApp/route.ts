import { NextResponse } from 'next/server';

import layoutFetcher from '@/server/layoutFetcher';
import { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import { EMPTY_STRING } from '@/utils/constants';
import { InitializeApp } from '@/lib/schema/initializeApp';

export async function GET() {
  const response: BaseAPIResponse<InitializeApp> = {
    data: {
      grades: [],
      certificate: [],
      internship: { grade: '5.00', isITCompany: false, tasks: [] },
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
    console.log(result);
    return NextResponse.json({ ...response, data: result });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json(
      { ...response, errorMessage: [error.message] },
      { status: 400 }
    );
  }
}
