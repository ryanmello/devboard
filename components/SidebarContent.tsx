"use client";

import {
  ContactRound,
  Home,
  PanelLeftClose,
  Settings,
  UnfoldHorizontal,
  Users,
} from "lucide-react";
import Image from "next/image";
import { Command, CommandGroup, CommandList } from "./ui/command";
import SidebarItem from "./SidebarItem";
import UserItem from "./UserItem";
import Logo from "@/public/white.png";
import { FullUser } from "@/types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const SidebarContent = ({ currentUser }: { currentUser: FullUser | null }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuList = [
    {
      group: "General",
      items: [
        {
          link: "/",
          icon: <Home />,
          text: "Home",
          hidden: false,
        },
        {
          link: "/community",
          icon: <Users />,
          text: "Community",
          hidden: false,
        },
        {
          link: `/${currentUser?.username}`,
          icon: <ContactRound />,
          text: "Profile",
          hidden: currentUser == null,
        },
        {
          link: "/settings",
          icon: <Settings />,
          text: "Settings",
          hidden: currentUser == null,
        },
      ],
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-r min-h-screen p-4 transition-width duration-300 ease-in-out fixed",
        isCollapsed ? "w-[73px] min-w-[73px]" : "w-[260px] min-w-[260px]"
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2 px-2 cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Image src={Logo} alt="DVB" width="24" height="24" />
          {!isCollapsed && <h1 className="font-bold">Devboard</h1>}
        </div>
      </div>
      <div className="grow">
        <Command>
          <CommandList>
            {menuList.map((menu: any, key: number) => (
              <CommandGroup key={key}>
                {menu.items
                  .filter((option: any) => !option.hidden)
                  .map((option: any, optionKey: number) => (
                    <SidebarItem
                      key={optionKey}
                      option={option}
                      isCollapsed={isCollapsed}
                      className="mb-0.5 last:mb-0"
                    />
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </div>
      <UserItem currentUser={currentUser} isCollapsed={isCollapsed} />
    </div>
  );
};

export default SidebarContent;
