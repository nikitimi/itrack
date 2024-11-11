import Header from '@/components/Header';
import Loading from '@/components/Loading';
import { Card } from '@/components/ui/card';
import CertificateConfirmation from '@/features/certificate/student/components/CertificateConfirmation';
import CertificateLoader from '@/features/certificate/student/components/CertificateLoader';
import CertificateSelector from '@/features/certificate/student/components/CertificateSelector';
import { Suspense } from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'iTrack | Student Certificate Module',
  description: 'Check your career trajectory anywhere and anytime.',
  icons: ['/favicon.ico'],
};

const Page = () => {
  return (
    <div>
      <Header />
      <Card className="mx-auto mt-24 w-3/4">
        <Suspense fallback={<Loading />}>
          <CertificateSelector />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <CertificateLoader />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <CertificateConfirmation />
        </Suspense>
      </Card>
    </div>
  );
};

export default Page;
