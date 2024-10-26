import React, { Suspense } from 'react';

import Header from '@/components/Header';
import Loading from '@/components/Loading';
import COGDataExtractor from '@/features/grade/student/components/COGDataExtractor';
import ModuleNav from '@/features/modules/student/components/ModuleNav';

const Grade = () => {
  return (
    <>
      <Header />
      <ModuleNav />
      <Suspense fallback={<Loading />}>
        <COGDataExtractor />
      </Suspense>
    </>
  );
};

export default Grade;
