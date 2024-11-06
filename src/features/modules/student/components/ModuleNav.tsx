'use client';

import Link from 'next/link';

import studentRoutesEnum, {
  type StudentRoute,
} from '@/lib/enums/routes/studentRoutes';
import { EMPTY_STRING, ROUTE_DIVIDER, WRONG_NUMBER } from '@/utils/constants';
import { usePathname } from 'next/navigation';
import {
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import getDynamicClasses from '@/utils/getDynamicClasses';
import { useEffect, useState } from 'react';
import { AdminRoute } from '@/lib/enums/routes/adminRoutes';
import { authenticationStatus } from '@/redux/reducers/authenticationReducer';
import { useAppSelector } from '@/hooks/redux';
import disabledNoUserList from '@/utils/authentication/disabledNoUserList';

const ModuleNav = () => {
  const studentRoutes = studentRoutesEnum.options;
  const pathname = usePathname() as StudentRoute;
  const [state, setState] = useState<(StudentRoute | AdminRoute)[]>([]);
  const authStatus = authenticationStatus(
    useAppSelector((s) => s.authentication)
  );
  const lastIndexOfRouteDivider =
    pathname?.lastIndexOf(ROUTE_DIVIDER) ?? WRONG_NUMBER;
  const pathName =
    pathname?.substring(lastIndexOfRouteDivider + 1, pathname.length) ??
    EMPTY_STRING;

  useEffect(() => {
    if (state.length === 0) {
      const moduleRoutes = studentRoutes.filter((route) => {
        const isModuleRoute =
          route.includes('modules') && route.split(ROUTE_DIVIDER).length > 3;

        // Limit the showing of modules to the condition on the next line.
        return isModuleRoute;
      });

      setState(moduleRoutes);
    }
  }, [state.length, studentRoutes]);

  return (
    <SidebarMenuSub>
      {state.map((route) => {
        const name = route.split('/')[3];

        const isActiveRoute = name === pathName;
        const defaultClasses = ['capitalize'];

        return (
          <SidebarMenuSubItem key={route}>
            <Link href={route}>
              <SidebarMenuButton
                disabled={
                  isActiveRoute || disabledNoUserList.includes(authStatus)
                }
                className={`${getDynamicClasses(isActiveRoute)} ${[
                  ...defaultClasses,
                ]}`}
              >
                {name}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuSubItem>
        );
      })}
    </SidebarMenuSub>
  );
};

export default ModuleNav;
