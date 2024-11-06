import Loading from '@/components/Loading';
import SigninCard from '@/components/student/SigninCard';
import { Suspense } from 'react';

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
