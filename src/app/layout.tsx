import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/app/globals.css';
import type { Children } from '@/utils/types/children';
import { Suspense } from 'react';
import Loading from '@/components/Loading';
import StoreProvider from '@/components/StoreProvider';
import { ClerkProvider } from '@clerk/nextjs';

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

export default function RootLayout({ children }: Children) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <Suspense fallback={<Loading />}>
            <StoreProvider>{children}</StoreProvider>
          </Suspense>
        </ClerkProvider>
      </body>
    </html>
  );
}
