import type { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import type { UploadFileResult } from 'uploadthing/types';

import url from 'url';
import { NextRequest, NextResponse } from 'next/server';

import utapi from '@/server/utils/utapi';

export async function POST(request: NextRequest) {
  const response: BaseAPIResponse<UploadFileResult[]> = {
    data: [],
    errorMessage: [],
  };
  try {
    const formdata = await request.formData();
    const paramQuery = url.parse(request.url, true).query;

    const blob = formdata.get('files') as Blob;
    if (blob === undefined) {
      return NextResponse.json('no file', { status: 400 });
    }

    const uploadedFiles = await utapi.uploadFiles(
      new File([blob], (paramQuery.fileName as string) ?? 'blob.pdf')
    );
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
