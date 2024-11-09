import type { AddUserTypeResponse } from '@/server/lib/schema/apiResponse/addUserType';

import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import type { StudentInfo } from '@/lib/schema/studentInfo';

export async function POST(request: Request) {
  const {
    specialization,
    studentNumber,
    userId,
    firstName,
    lastName,
    middleInitial,
  } = (await request.json()) as StudentInfo;
  const clerk = await clerkClient();
  let response: AddUserTypeResponse = {
    data: '',
    errorMessage: [],
  };

  const user = await clerk.users.updateUserMetadata(userId, {
    publicMetadata: {
      specialization,
      studentNumber,
      middleInitial,
    },
  });

  await clerk.users
    .updateUser(userId, {
      firstName,
      lastName,
    })
    .catch((e) =>
      NextResponse.json({ ...response, errorMessage: [(e as Error).message] })
    );

  const publicMetadata = user.publicMetadata as Record<
    'studentNumber',
    string | undefined
  >;
  const isStudent = publicMetadata['studentNumber'];

  if (isStudent === undefined) {
    response = {
      ...response,
      errorMessage: ['Role is not set in the public metadata of the user.'],
    };

    return NextResponse.json(response, { status: 500 });
  }

  response = {
    ...response,
    data: `Successfully added role to ${userId}`,
  };

  return NextResponse.json(response);
}
