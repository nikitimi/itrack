export const aboutRoute = '/';

/** Don't move the index 0, it is the default dashboard route. */
export const adminRoutes = [
  '/admin' /** Dashboard */,
  '/admin/job',
  '/admin/job/create',
  '/admin/job/update',
  '/admin/job/delete',
  '/admin/signin',
  '/admin/student',
  '/admin/student/certificate',
  '/admin/student/grade',
  '/admin/student/internship',
  '/admin/student/result',
  aboutRoute,
] as const;
/** Don't move the index 0, it is the default dashboard route. */
export const studentRoutes = [
  '/student' /** Dashboard */,
  '/student/modules',
  '/student/modules/certificate',
  '/student/modules/grade',
  '/student/modules/internship',
  '/student/profile',
  '/student/signin',
  '/student/signup',
  '/student/verify-email',
  aboutRoute,
] as const;

/** These are the routes for anonymous users. */
export const publicRoutes = [
  '/forgot-password',
  '/signup',
  '/signin',
  '/verify-email',
  '/verify-new-password',
] as const;
export default {
  admin: adminRoutes,
  student: studentRoutes,
} as const;
