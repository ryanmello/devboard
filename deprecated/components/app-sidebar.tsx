"use client";

import * as React from "react";
import { Home, Settings, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "@/public/white.png";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { FullUser } from "@/types";
import { useRouter } from "next/navigation";

export function AppSidebar({ currentUser }: { currentUser: FullUser | null }) {
  const router = useRouter();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2 px-2 cursor-pointer">
              <Image src={Logo} alt="DVB" width="24" height="24" />
              <h1 className="font-bold">Devboard</h1>
            </div>
          </div>
        </SidebarHeader>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupContent>
              {currentUser && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => router.push(`/${currentUser?.username}`)}
                    >
                      <User />
                      <span>Profile</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {currentUser && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/settings">
                      <Settings />
                      <span>Settings</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>{/* Add footer content if needed */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
