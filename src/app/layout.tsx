import type { Metadata } from 'next';

import type { Children } from '@/utils/types/children';

import { ClerkProvider } from '@clerk/nextjs';
import localFont from 'next/font/local';
import { Suspense } from 'react';

import Loading from '@/components/Loading';
import StoreProvider from '@/components/StoreProvider';

import '@/app/globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { headers } from 'next/headers';
import type { StudentInfo } from '@/lib/schema/studentInfo';
import { HEADER_KEY } from '@/utils/constants';

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'iTrack | About',
  description: 'Tracking your future!',
};

export default async function RootLayout({ children }: Children) {
  const headerList = headers();
  const { origin, pathname, role, url, ...rest } = HEADER_KEY;
  console.log('Removing ', origin, pathname, role, url, ' in header keys');
  const studentInfo = Object.fromEntries(
    Object.entries(rest).map(([k, v]) => [k, headerList.get(v)])
  ) as Partial<StudentInfo>;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<Loading />}>
          <ClerkProvider dynamic>
            <SidebarProvider>
              <StoreProvider {...studentInfo}>
                <AppSidebar />
                <main className="w-full">{children}</main>
              </StoreProvider>
            </SidebarProvider>
          </ClerkProvider>
        </Suspense>
      </body>
    </html>
  );
}
