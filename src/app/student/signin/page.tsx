import Loading from '@/components/Loading';
import SigninCard from '@/components/student/SigninCard';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'iTrack | Student Signin',
  description: 'Check your career trajectory anywhere and anytime.',
  icons: ['/favicon.ico'],
};

const Signin = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <div className="flex h-screen items-center justify-center">
          <SigninCard />
        </div>
      </Suspense>
    </>
  );
};

export default Signin;
