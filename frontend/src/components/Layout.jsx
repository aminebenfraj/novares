import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';
import { Home, Box, PenToolIcon as Tool, ListIcon as Category, MapPin } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar>
        <SidebarHeader>
          <h2 className="px-4 py-2 text-lg font-semibold">Inventory Management</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/">
                  <Home className="w-4 h-4 mr-2" />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/suppliers">
                  <Box className="w-4 h-4 mr-2" />
                  <span>Suppliers</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/machines">
                  <Tool className="w-4 h-4 mr-2" />
                  <span>Machines</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/materials">
                  <Box className="w-4 h-4 mr-2" />
                  <span>Materials</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/categories">
                  <Category className="w-4 h-4 mr-2" />
                  <span>Categories</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/locations">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Locations</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
