'use client';

import { SidebarMenuSkeleton, SidebarTrigger } from '@/components/ui/sidebar';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import AppLogo from '@/components/AppLogo';
import { Button } from '@/components/ui/button';
import useAppRouter from '@/hooks/useAppRouter';
import { ProgressTracker } from '@/components/student/ProgressTracker';
import disabledWithUserList from '@/utils/authentication/disabledWithUserList';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';
import { useAppSelector } from '@/hooks/redux';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';
import { useClerk } from '@clerk/nextjs';
import SignoutButton from './SignoutButton';

type ClerkPublicMetadata = {
  studentNumber: string;
};

const Header = () => {
  const { user } = useClerk();
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );

  const metadata = user?.publicMetadata as ClerkPublicMetadata | undefined;

  switch (authStatus) {
    case 'initializing':
      return (
        <header className="fixed top-0 z-10 w-full bg-white/95 shadow-md">
          <SidebarMenuSkeleton />
        </header>
      );
    case 'no user':
    case 'verifying account':
    case 'verifying new password':
      return <HeaderNoUser />;
    case 'authenticated':
      return (
        <header className="fixed top-0 z-10 w-full bg-white/95 shadow-md">
          {typeof metadata?.studentNumber === 'string' ? (
            <>
              {' '}
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={50}>
                  <SidebarTrigger
                    disabled={disabledNoUserList.includes(authStatus)}
                  />
                </ResizablePanel>
                <ResizableHandle disabled className="opacity-0" />
                <ResizablePanel defaultSize={50} />
              </ResizablePanelGroup>
              <ProgressTracker />
            </>
          ) : (
            <div className="flex justify-between p-2">
              <section className="flex items-end justify-between gap-2">
                <AppLogo />
                <p className="text-lg font-bold">Admin</p>
              </section>
              <SignoutButton />
            </div>
          )}
        </header>
      );
  }
};

export const HeaderNoUser = () => {
  const router = useAppRouter();
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );

  return (
    <header className="p-4 shadow-md">
      <Button
        disabled={disabledWithUserList.includes(authStatus)}
        variant="secondary"
        onClick={() => router.push('/student/signin')}
      >
        <AppLogo />
      </Button>
    </header>
  );
};

export default Header;
