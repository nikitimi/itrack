'use client';

import Image from 'next/image';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import Nav from '@/components/Nav';
import NavProjectsSkeleton from '@/components/NavProjectsSkeleton';
import SignoutButton from '@/components/SignoutButton';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';
import { useAppSelector } from '@/hooks/redux';
import { useAuth, useClerk } from '@clerk/nextjs';

const AppSidebar = () => {
  const backgroundClasses =
    'bg-gradient-to-r from-bg-white  to-itrack-primary/80';
  const { userId } = useAuth();
  const authState = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const clerk = useClerk();
  const isAdmin =
    clerk.session?.publicUserData.identifier === process.env.NEXT_PUBLIC_ADMIN;

  switch (authState) {
    case 'initializing':
      if (isAdmin) return <></>;
      if (typeof userId === 'string') {
        return (
          <Sidebar>
            <SidebarHeader className={backgroundClasses}>
              <SidebarMenuSkeleton />
            </SidebarHeader>
            <SidebarContent className={backgroundClasses}>
              <SidebarGroup>
                <SidebarGroupLabel>Routes</SidebarGroupLabel>
                <SidebarGroupContent>
                  <NavProjectsSkeleton />
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className={backgroundClasses}>
              <SignoutButton />
            </SidebarFooter>
          </Sidebar>
        );
      }
      return <></>;
    case 'no user':
    case 'verifying account':
    case 'verifying new password':
      return <></>;
    case 'authenticated':
      if (isAdmin) return <></>;
      return (
        <Sidebar>
          <SidebarHeader className={backgroundClasses}>
            <div className="mx-auto h-full w-32">
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
                <Nav />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className={backgroundClasses}>
            <SignoutButton />
          </SidebarFooter>
        </Sidebar>
      );
  }
};

export default AppSidebar;
