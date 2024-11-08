import { Suspense } from 'react';

import Header from '@/components/Header';
import Loading from '@/components/Loading';
import ModuleResults from '@/features/modules/student/components/ModuleResults';

const Modules = () => {
  return (
    <>
      <Header />
      <Suspense fallback={<Loading />}>
        <ModuleResults />
      </Suspense>
    </>
  );
};

export default Modules;
