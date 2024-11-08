'use client';

import { usePathname } from 'next/navigation';

import adminRoutesEnum, { AdminRoute } from '@/lib/enums/routes/adminRoutes';
import publicRoutesEnum from '@/lib/enums/routes/publicRoutes';
import studentRoutesEnum, {
  StudentRoute,
} from '@/lib/enums/routes/studentRoutes';
import { EMPTY_STRING, ROUTE_DIVIDER } from '@/utils/constants';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { LayoutDashboardIcon, LifeBuoyIcon, PieChartIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
// eslint-disable-next-line boundaries/element-types
import ModuleNav from '@/features/modules/student/components/ModuleNav';
import getDynamicClasses from '@/utils/getDynamicClasses';
import { useAppSelector } from '@/hooks/redux';
import {
  authenticationStatus,
  authenticationUserType,
} from '@/redux/reducers/authenticationReducer';
import { useEffect, useState } from 'react';

const adminRoutes = adminRoutesEnum.options;
const publicRoutes = publicRoutesEnum.options;
const studentRoutes = studentRoutesEnum.options;

const Nav = () => {
  const pathname = usePathname();
  const authSelector = useAppSelector((s) => s.authentication);
  const userRole = authenticationUserType(authSelector);
  const authStatus = authenticationStatus(authSelector);
  const isAuthInitializing = authStatus === 'initializing';
  const [state, setState] = useState<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { title: string; url: StudentRoute | AdminRoute; icon: any }[]
  >([]);

  function routeHelper(route: StudentRoute | AdminRoute) {
    const routeFragments = route.split(ROUTE_DIVIDER);
    const filteredRouteFragments = routeFragments.filter(
      (r) => r !== EMPTY_STRING
    );
    const finalRouteName =
      filteredRouteFragments.length === 0
        ? 'about'
        : filteredRouteFragments[filteredRouteFragments.length - 1];
    return { filteredRouteFragments, finalRouteName };
  }

  useEffect(() => {
    function initializeNav() {
      if (state.length === 0) {
        const isPathnameForStudents =
          pathname.includes('/student') || userRole === 'student';
        const dynamicRoute = isPathnameForStudents
          ? studentRoutes
          : adminRoutes;
        const dashboard = dynamicRoute[0];
        const iconRecord = {
          dashboard: PieChartIcon,
          modules: LayoutDashboardIcon,
          // profile: UserIcon,
          about: LifeBuoyIcon,
        };
        const renderThisRoutes = dynamicRoute
          .filter((route) => {
            const { finalRouteName } = routeHelper(route);

            return !publicRoutes.toLocaleString().includes(finalRouteName);
          })
          .map((route) => {
            const { filteredRouteFragments, ...rest } = routeHelper(route);
            const finalRouteName =
              dashboard === route ? 'dashboard' : rest.finalRouteName;
            const icon = iconRecord[finalRouteName as keyof typeof iconRecord];
            return filteredRouteFragments.length === 3 || !icon
              ? null
              : {
                  title: finalRouteName,
                  url: route,
                  icon,
                };
          })
          .filter((i) => i !== null);
        setState(renderThisRoutes);
      }
    }

    return initializeNav();
  }, [state.length, userRole, pathname]);

  return (
    <SidebarMenu>
      {state.map((item) => {
        const isModules = item.title === 'modules';
        const dynamicClasses = getDynamicClasses(pathname === item.url);

        return isModules ? (
          <Collapsible open className="group/collapsible" key={item.title}>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                disabled={isModules}
                className="hover:bg-transparent active:bg-transparent"
              >
                <a className="flex">
                  <item.icon />
                  <span className="capitalize">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <CollapsibleContent>
              <ModuleNav />
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              className={isAuthInitializing ? '' : dynamicClasses}
              disabled={isAuthInitializing}
            >
              <a href={isAuthInitializing ? '/student' : item.url}>
                <item.icon />
                <span className="capitalize">{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};

export default Nav;
