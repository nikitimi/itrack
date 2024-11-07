import { clerkMiddleware } from '@clerk/nextjs/server';

import type { AdminRoute } from '@/lib/enums/routes/adminRoutes';
import type { StudentRoute } from '@/lib/enums/routes/studentRoutes';
import handleClerkAuthMiddleware from '@/server/utils/middleware/handleClerkAuthMiddleware';
import setStudentNumber from '@/server/utils/middleware/setStudentNumber';
import { HEADER_KEY } from '@/utils/constants';
import { GetStudentNumber } from '@/server/lib/schema/apiResponse/getStudentNumber';

type Routes = AdminRoute | StudentRoute;

export default clerkMiddleware(async (auth, request) => {
  const session = await auth();
  const url = new URL(request.url);
  const origin = url.origin;
  const pathname = url.pathname as Routes;

  if (session.sessionId === null) {
    return handleClerkAuthMiddleware(pathname, request);
  }

  const studentNumberResult = await setStudentNumber(session, origin);

  if (typeof studentNumberResult === 'string')
    return console.log(
      'Student number fetched is a string, cannot set in headers.'
    );

  const { role, specialization, studentNumber, firstName, lastName } =
    studentNumberResult as GetStudentNumber;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(HEADER_KEY.origin, origin);
  requestHeaders.set(HEADER_KEY.pathname, pathname);
  requestHeaders.set(HEADER_KEY.role, role);
  requestHeaders.set(HEADER_KEY.studentNumber, studentNumber);
  requestHeaders.set(HEADER_KEY.specialization, specialization);
  requestHeaders.set(HEADER_KEY.firstName, firstName);
  requestHeaders.set(HEADER_KEY.lastName, lastName);
  requestHeaders.set(HEADER_KEY.uid, session.userId);
  requestHeaders.set(HEADER_KEY.url, request.url);

  return handleClerkAuthMiddleware(pathname, request, requestHeaders);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
