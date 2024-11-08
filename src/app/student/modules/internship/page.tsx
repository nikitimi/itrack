import { Suspense } from 'react';

import Header from '@/components/Header';
import Loading from '@/components/Loading';

import InternshipTaskLoader from '@/features/internship/components/InternshipTaskLoader';
import InternshipTaskSelector from '@/features/internship/components/InternshipTaskSelector';
import InternshipTaskConfirmation from '@/features/internship/components/InternshipTaskConfirmation';
import InternshipIsITCompany from '@/features/internship/components/InternshipIsITCompany';
import InternshipGrade from '@/features/internship/components/internshipGrade';

const Internship = () => {
  return (
    <div>
      <Header />
      <Suspense fallback={<Loading />}>
        <div className="pt-12">
          <InternshipIsITCompany />
          <InternshipGrade />
          <InternshipTaskSelector />
          <InternshipTaskLoader />
          <InternshipTaskConfirmation />
        </div>
      </Suspense>
    </div>
  );
};

export default Internship;
