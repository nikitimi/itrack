'use client';

import { Suspense } from 'react';
import Image from 'next/image';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from '@/components/ui/sidebar';
import Nav from '@/components/Nav';
import NavProjectsSkeleton from '@/components/NavProjectsSkeleton';
import SignoutButton from '@/components/SignoutButton';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';
import { useAppSelector } from '@/hooks/redux';
import { useAuth, useClerk } from '@clerk/nextjs';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';

const AppSidebar = () => {
  const backgroundClasses = 'bg-slate-50';
  const { userId } = useAuth();
  const authState = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const clerk = useClerk();
  const isAdmin =
    clerk.session?.publicUserData.identifier === 'admin@itrack.vercel.app';

  if (
    (disabledNoUserList.includes(authState) && typeof userId !== 'string') ||
    isAdmin
  )
    return <></>;

  return (
    <Sidebar>
      <SidebarHeader className={backgroundClasses}>
        <div className="h-auto w-32">
          <Image
            src="/itrack-removebg.png"
            width={80}
            height={60}
            alt="logo"
            className="h-auto w-auto"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className={backgroundClasses}>
        <SidebarGroup>
          <SidebarGroupLabel>Routes</SidebarGroupLabel>
          <SidebarGroupContent>
            <Suspense fallback={<NavProjectsSkeleton />}>
              <Nav />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className={backgroundClasses}>
        <SignoutButton />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
