import { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import utapi from '@/server/utils/utapi';
import { NextResponse } from 'next/server';

export async function GET() {
  const response: BaseAPIResponse<
    {
      name: string;
      customId: string | null;
      key: string;
      status: 'Deletion Pending' | 'Failed' | 'Uploaded' | 'Uploading';
      id: string;
    }[]
  > = {
    data: [],
    errorMessage: [],
  };
  try {
    const { files } = await utapi.listFiles();

    const uploadedFiles = files.filter((f) => f.status === 'Uploaded');

    return NextResponse.json({ ...response, data: uploadedFiles });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json(
      { ...response, errorMessage: [error.message] },
      { status: 400 }
    );
  }
}
