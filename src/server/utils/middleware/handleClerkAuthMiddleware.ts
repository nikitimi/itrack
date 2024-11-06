'server only';

import type { UserRole } from '@/lib/enums/userRole';

import { NextRequest, NextResponse } from 'next/server';

import adminRoutesEnum from '@/lib/enums/routes/adminRoutes';
import studentRoutesEnum from '@/lib/enums/routes/studentRoutes';
import publicRoutesEnum from '@/lib/enums/routes/publicRoutes';
import { EMPTY_STRING, HEADER_KEY } from '@/utils/constants';
import generateProtectedRoutes from '@/utils/generateProtectedRoutes';

type PossibleRoutes = ReturnType<typeof generateProtectedRoutes>[number];

const studentRoutes = studentRoutesEnum.options;
const adminRoutes = adminRoutesEnum.options;
const publicRoutes = publicRoutesEnum.options;
const protectedStudentRoutes = generateProtectedRoutes(studentRoutes);
const protectedAdminRoutes = generateProtectedRoutes(adminRoutes);

export default function handleClerkAuthMiddleware(
  pathname: PossibleRoutes,
  request: NextRequest,
  requestHeaders?: Headers
) {
  // No User.
  if (requestHeaders === undefined) {
    switch (true) {
      case protectedStudentRoutes.includes(pathname):
        console.log('Going to signin student');
        return NextResponse.redirect(new URL('/student/signin', request.url));
      case protectedAdminRoutes.includes(pathname):
        console.log('Going to signin admin');
        return NextResponse.redirect(new URL('/admin/signin', request.url));
      // TODO: Uncomment to restrict API access to not signed in users.
      // case request.nextUrl.href.includes('api'):
      //   return NextResponse.json(
      //     { data: [], errorMessage: 'You are not authorized to send request' },
      //     { status: 400 }
      //   );
    }
    return;
  }

  const pathSplitted = pathname.split('/');
  const role = requestHeaders.get(HEADER_KEY.role) as UserRole;
  const isStudent = role === 'student';
  const currentPath = pathSplitted[pathSplitted.length - 1];
  const formattedPublicRoutes = publicRoutes.map((v) =>
    v.replace('/', EMPTY_STRING)
  );

  console.log({ role });
  const unauthorizedRoutes = isStudent
    ? protectedAdminRoutes
    : protectedStudentRoutes;

  // Protects the public route.
  if (formattedPublicRoutes.includes(currentPath)) {
    const isStudentPath = pathSplitted.includes('student');
    const redirectPathname = isStudentPath && isStudent ? '/student' : '/admin';
    console.log(`Accessing public route, redirecting to ${redirectPathname}.`);
    return NextResponse.redirect(new URL(redirectPathname, request.url));
  }

  // Protects the protected routes in unauthorized access.
  if (unauthorizedRoutes.includes(pathname)) {
    const redirectPathname = isStudent ? '/student' : '/admin';
    console.log(`Accessing ❌ route, redirecting to ${redirectPathname}.`);
    return NextResponse.redirect(new URL(redirectPathname, request.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
