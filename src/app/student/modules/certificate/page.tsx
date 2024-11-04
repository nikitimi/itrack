import Header from '@/components/Header';
import Loading from '@/components/Loading';
import { Card } from '@/components/ui/card';
import CertificateConfirmation from '@/features/certificate/student/components/CertificateConfirmation';
import CertificateLoader from '@/features/certificate/student/components/CertificateLoader';
import CertificateSelector from '@/features/certificate/student/components/CertificateSelector';
import { Suspense } from 'react';

const Page = () => {
  return (
    <div>
      <Header />
      <Card className="mt-12 rounded-none border-none shadow-none">
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
