import type {
  GetStudentNumber,
  GetStudentNumberResponse,
} from '@/server/lib/schema/apiResponse/getStudentNumber';

import { clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import url from 'url';

type UserMetadata = Pick<
  GetStudentNumber,
  'studentNumber' | 'middleInitial' | 'specialization'
>;

/** Uses `userId` to fetch `PublicMetadata` about the user, if `userId` is not present,
 * These will fetch all `userId` with `studentNumber`.
 */
export async function GET(request: NextRequest) {
  try {
    const clerk = await clerkClient();
    const userId = url.parse(request.url, true).query.userId as string;
    const response: GetStudentNumberResponse = {
      data: [],
      errorMessage: [],
    };

    // Many students.
    if (userId === undefined) {
      const users = await clerk.users.getUserList();
      const studentNumbers: string[] = users.data.map(
        (user) => (user.publicMetadata as UserMetadata).studentNumber
      );

      console.log(studentNumbers);

      return NextResponse.json({
        ...response,
        data: studentNumbers.filter((u) => u !== undefined),
      });
    }

    // const userCache = unstable_cache(
    //   () => clerk.users.getUser(userId),
    //   ['userInfo']
    // );

    const { publicMetadata, firstName, lastName } =
      await clerk.users.getUser(userId);
    const userMetadata = publicMetadata as UserMetadata;

    const studentNumber = userMetadata['studentNumber'];
    const middleInitial = userMetadata['middleInitial'];
    const specialization = userMetadata['specialization'];

    if (studentNumber === undefined) {
      return NextResponse.json(
        { ...response, data: 'You are not a student.' },
        { status: 201 }
      );
    }
    // One student.
    return NextResponse.json({
      ...response,
      data: [
        {
          firstName,
          lastName,
          middleInitial,
          specialization,
          studentNumber,
        },
      ],
    });
  } catch (e) {
    const error = e as Error;
    const errorResponse: GetStudentNumberResponse = {
      data: [],
      errorMessage: [error.message],
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
