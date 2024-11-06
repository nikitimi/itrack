'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import AppLogo from '@/components/AppLogo';
import { Button } from './ui/button';
import useAppRouter from '@/hooks/useAppRouter';
import { ProgressTracker } from './student/ProgressTracker';
import disabledWithUserList from '@/utils/authentication/disabledWithUserList';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';
import { useAppSelector } from '@/hooks/redux';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';

const Header = () => {
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );

  return (
    <header className="fixed top-0 w-full bg-white/90 shadow-md">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <SidebarTrigger disabled={disabledNoUserList.includes(authStatus)} />
        </ResizablePanel>
        <ResizableHandle disabled />
        <ResizablePanel defaultSize={50} />
      </ResizablePanelGroup>
      <ProgressTracker />
    </header>
  );
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
