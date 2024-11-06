import { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import { clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log(request);
  const response: BaseAPIResponse<string> = {
    data: '',
    errorMessage: [],
  };

  const client = await clerkClient();
  const userLists = await client.users.getUserList();

  const students = userLists.data
    .filter(({ publicMetadata }) => publicMetadata.role === 'student')
    .map(({ firstName, lastName, publicMetadata }) => ({
      firstName,
      lastName,
      ...publicMetadata,
    }));

  return NextResponse.json({ ...response, data: students });
}
