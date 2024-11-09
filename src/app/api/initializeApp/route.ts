import { NextResponse } from 'next/server';

import layoutFetcher from '@/server/layoutFetcher';
import { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import { EMPTY_STRING, HEADER_KEY } from '@/utils/constants';
import { InitializeApp } from '@/lib/schema/initializeApp';
import { headers } from 'next/headers';
import { Specialization } from '@/lib/enums/specialization';

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
    const headerList = headers();
    const studentNumber = headerList.get(HEADER_KEY.studentNumber) as
      | string
      | null;
    const specialization = headerList.get(
      HEADER_KEY.specialization
    ) as Specialization | null;
    const userId = headerList.get(HEADER_KEY.userId) as string | null;
    const result = await layoutFetcher({
      studentNumber: studentNumber ?? EMPTY_STRING,
      specialization: specialization ?? 'BUSINESS_ANALYTICS',
      userId: userId ?? EMPTY_STRING,
    });
    console.log('Initialize app result: ', { result });
    return NextResponse.json({ ...response, data: result });
  } catch (e) {
    const error = e as Error;
    console.log(error.message);
    return NextResponse.json(
      { ...response, errorMessage: [error.message] },
      { status: 400 }
    );
  }
}
