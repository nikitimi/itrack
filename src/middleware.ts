import { NextResponse } from 'next/server';
import { EMPTY_STRING } from './utils/constants';
import { publicRoutes } from './utils/routes';

const withUsers = ['admin', 'student'] as const;

export default function middleware(request: Request) {
  // ALL ABOUT URL. //
  const url = new URL(request.url);
  const origin = url.origin;
  const pathname = url.pathname;

  const role = 'student' as (typeof withUsers)[number] | null;
  const isDashboard = pathname === `/${role}`;
  const prefixPathname = pathname.split('/').filter((s) => s !== EMPTY_STRING);
  /** student | admin | EMPTY_STRING. */
  const rolePath = prefixPathname[0];
  const suffixPathname = prefixPathname[prefixPathname.length - 1];
  const indexOfPathName = publicRoutes
    .map((s) => s.replace(/\//, EMPTY_STRING))
    .indexOf(suffixPathname);
  const isCurrentPathPublic = indexOfPathName > -1;
  const isUserPresent = withUsers.includes(role as (typeof withUsers)[number]);

  // SERVER SIDE ACTIONS GOES HERE. //
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', request.url);
  requestHeaders.set('x-origin', origin);
  requestHeaders.set('x-pathname', pathname);

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
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
