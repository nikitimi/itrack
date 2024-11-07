import type { AddUserTypeResponse } from '@/server/lib/schema/apiResponse/addUserType';

import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import StudentCreation from '@/utils/types/studentCreation';

export async function POST(request: Request) {
  const {
    role,
    specialization,
    studentNumber,
    userId,
    firstName,
    lastName,
    middleInitial,
  } = (await request.json()) as StudentCreation;
  const clerk = await clerkClient();
  let response: AddUserTypeResponse = {
    data: '',
    errorMessage: [],
  };

  const user = await clerk.users.updateUserMetadata(userId, {
    publicMetadata: {
      role,
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
    'role',
    string | undefined
  >;
  const roleMetadata = publicMetadata['role'];

  if (roleMetadata === undefined) {
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
