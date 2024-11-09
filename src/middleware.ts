import type { AdminRoute } from '@/lib/enums/routes/adminRoutes';
import type { StudentRoute } from '@/lib/enums/routes/studentRoutes';
import type { UserRole } from '@/lib/enums/userRole';
import type { StudentPublicMetadata } from '@/lib/schema/studentInfo';

import { clerkClient, clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import publicRoutesEnum from '@/lib/enums/routes/publicRoutes';
import userRoleEnum from '@/lib/enums/userRole';
import { EMPTY_STRING, HEADER_KEY } from '@/utils/constants';

type Routes = AdminRoute | StudentRoute;

export default clerkMiddleware(async (auth, request) => {
  // ALL AUTHENTICATION. //
  const session = await auth();
  let role = null as UserRole | null;
  const requestHeaders = new Headers(request.headers);

  if (session.userId !== null) {
    const clerk = await clerkClient();
    const userInfo = await clerk.users.getUser(session.userId);
    const studentPublicMetadata =
      userInfo.publicMetadata as Partial<StudentPublicMetadata>;
    const isAdmin = studentPublicMetadata.studentNumber === undefined;
    requestHeaders.set(HEADER_KEY.userId, session.userId);
    role = isAdmin ? 'admin' : 'student';

    requestHeaders.set(HEADER_KEY.role, role);

    if (!isAdmin) {
      const { middleInitial, specialization, studentNumber } =
        studentPublicMetadata;
      requestHeaders.set(HEADER_KEY.studentNumber, studentNumber!);
      requestHeaders.set(HEADER_KEY.specialization, specialization!);
      requestHeaders.set(
        HEADER_KEY.middleInitial,
        middleInitial ?? EMPTY_STRING
      );
      requestHeaders.set(
        HEADER_KEY.firstName,
        userInfo.firstName ?? EMPTY_STRING
      );
      requestHeaders.set(
        HEADER_KEY.lastName,
        userInfo.lastName ?? EMPTY_STRING
      );
    }
  }

  // ALL ABOUT URL. //
  const url = new URL(request.url);
  const origin = url.origin;
  const pathname = url.pathname as Routes;

  const isDashboard = pathname === `/${role}`;
  const prefixPathname = pathname.split('/').filter((s) => s !== EMPTY_STRING);
  /** student | admin | EMPTY_STRING. */
  const rolePath = prefixPathname[0];
  const suffixPathname = prefixPathname[prefixPathname.length - 1];
  const indexOfPathName = publicRoutesEnum.options
    .map((s) => s.replace(/\//, EMPTY_STRING))
    .indexOf(suffixPathname);
  const isCurrentPathPublic = indexOfPathName > -1;
  const isUserPresent = userRoleEnum.options.includes(role!);

  requestHeaders.set(HEADER_KEY.origin, origin);
  requestHeaders.set(HEADER_KEY.pathname, pathname);
  requestHeaders.set(HEADER_KEY.url, request.url);

  console.log({ pathname }, ' this is the pathname.');

  // All shared routes goes here.
  if (pathname === '/') {
    console.log('shared routes setting headers...');
    return NextResponse.next({
      request: {
        ...request,
        headers: requestHeaders,
      },
    });
  }

  // No user           visits private routes.
  //  vvvvvvvvvvvvv    vvvvvvvvvvvvvvvvvvvv
  if (role === null && !isCurrentPathPublic) {
    const roleSignin = `/${rolePath}/signin`;
    console.log("redirecting to relative to visited role's signin");
    return NextResponse.redirect(new URL(roleSignin, origin));
  }

  // Check if the role is visiting non scope role.
  if (
    isUserPresent &&
    !isDashboard &&
    (rolePath !== role || isCurrentPathPublic)
  ) {
    console.log('redirecting to role signin');
    return NextResponse.redirect(new URL(`/${role}`, origin));
  }

  console.log('authenticated setting headers...');
  return NextResponse.next({
    request: {
      ...request,
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
