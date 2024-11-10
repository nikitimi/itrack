import { Suspense } from 'react';

import Header from '@/components/Header';
import Loading from '@/components/Loading';
import COGDataExtractor from '@/features/grade/student/components/COGDataExtractor';
import COGDataLoader from '@/features/grade/student/components/COGDataLoader';

const Grade = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col gap-8">
        <Suspense fallback={<Loading />}>
          <Suspense fallback={<Loading />}>
            <COGDataExtractor />
          </Suspense>
        </Suspense>
        <Suspense fallback={<Loading />}>
          <COGDataLoader />
        </Suspense>
      </div>
    </>
  );
};

export default Grade;
