import { Suspense } from 'react';

import Header from '@/components/Header';
import Loading from '@/components/Loading';

import InternshipTaskLoader from '@/features/internship/components/InternshipTaskLoader';
import InternshipTaskSelector from '@/features/internship/components/InternshipTaskSelector';
import InternshipTaskConfirmation from '@/features/internship/components/InternshipTaskConfirmation';
import InternshipIsITCompany from '@/features/internship/components/InternshipIsITCompany';
import InternshipGrade from '@/features/internship/components/internshipGrade';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'iTrack | Student Internship Module',
  description: 'Check your career trajectory anywhere and anytime.',
  icons: ['/favicon.ico'],
};

const Internship = () => {
  return (
    <div>
      <Header />
      <Suspense fallback={<Loading />}>
        <div className="mx-auto flex w-3/4 flex-col gap-8 pt-24">
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
