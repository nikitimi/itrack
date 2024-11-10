import type { BaseAPIResponse } from '@/server/lib/schema/apiResponse';

import utapi from '@/server/utils/utapi';
import { NextRequest, NextResponse } from 'next/server';
import type { UploadFileResult } from 'uploadthing/types';

export async function POST(request: NextRequest) {
  const response: BaseAPIResponse<UploadFileResult[]> = {
    data: [],
    errorMessage: [],
  };
  try {
    const formdata = await request.formData();

    const files = formdata.getAll('files') as File[];
    if (files === undefined)
      return NextResponse.json('no file', { status: 400 });
    const uploadedFiles = await utapi.uploadFiles(files);
    console.log(uploadedFiles);
    return NextResponse.json({
      ...response,
      data: uploadedFiles,
    });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ ...response, errorMessage: [error.message] });
  }
}
