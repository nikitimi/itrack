import type { BaseAPIResponse } from '@/server/lib/schema/apiResponse';

import utapi from '@/server/utils/utapi';
import { EMPTY_STRING } from '@/utils/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response: BaseAPIResponse<string> = {
    data: EMPTY_STRING,
    errorMessage: [],
  };
  try {
    const json = await request.json();
    const response = await utapi.deleteFiles(json.name);

    return NextResponse.json({ ...response, data: 'Success deletion!' });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ ...response, errorMessage: [error.message] });
  }
}
