import {
  SidebarMenu,
  SidebarMenuSkeleton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const NavProjectsSkeleton = () => {
  return (
    <SidebarMenu>
      {Array.from({ length: 6 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default NavProjectsSkeleton;
