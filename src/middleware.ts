import type { AdminRoute } from '@/lib/enums/routes/adminRoutes';
import type { StudentRoute } from '@/lib/enums/routes/studentRoutes';

import { clerkMiddleware } from '@clerk/nextjs/server';
import { EMPTY_STRING, HEADER_KEY } from '@/utils/constants';
import { NextResponse } from 'next/server';

type Routes = AdminRoute | StudentRoute;

export default clerkMiddleware(async (auth, request) => {
  const session = await auth();
  const url = new URL(request.url);
  const origin = url.origin;
  const pathname = url.pathname as Routes;
  const pathPrefix = pathname.split('/').filter((p) => p !== EMPTY_STRING)[0];

  if (pathPrefix === '/') {
    return NextResponse.next({ request });
  }

  if (session.userId === null) {
    return NextResponse.redirect(new URL(`/${pathPrefix}/signin`, origin));
  }

  // const studentNumberResult = await setStudentNumber(session);

  // console.log(studentNumberResult);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(HEADER_KEY.uid, session.userId);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });

  // if (typeof studentNumberResult === 'string')
  //   return console.log(
  //     'Student number fetched is a string, cannot set in headers.'
  //   );

  // const { role, specialization, studentNumber, firstName, lastName } =
  //   studentNumberResult as GetStudentNumber;

  // requestHeaders.set(HEADER_KEY.origin, origin);
  // requestHeaders.set(HEADER_KEY.pathname, pathname);
  // requestHeaders.set(HEADER_KEY.role, role);
  // requestHeaders.set(HEADER_KEY.studentNumber, studentNumber);
  // requestHeaders.set(HEADER_KEY.specialization, specialization);
  // requestHeaders.set(HEADER_KEY.firstName, firstName);
  // requestHeaders.set(HEADER_KEY.lastName, lastName);
  // requestHeaders.set(HEADER_KEY.uid, session.userId);
  // requestHeaders.set(HEADER_KEY.url, request.url);

  // return handleClerkAuthMiddleware(pathname, request, requestHeaders);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
