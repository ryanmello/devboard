"use client";

import { ContactRound, Home, Settings, Users } from "lucide-react";
import Image from "next/image";
import { Command, CommandGroup, CommandList } from "./ui/command";
import SidebarItem from "./SidebarItem";
import UserItem from "./UserItem";
import Logo from "@/public/white.png";
import { FullUser } from "@/types";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
        },
        {
          link: `/${currentUser?.username}`,
          icon: <ContactRound />,
          text: "Profile",
        },
        {
          link: "/community",
          icon: <Users />,
          text: "Community",
        },
        {
          link: "/settings",
          icon: <Settings />,
          text: "Settings",
        },
      ],
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col gap-4 w-[260px] min-w-[260px] border-r min-h-screen p-4",
        isCollapsed && "w-[74px] min-w-[74px]"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-2">
          <Image
            src={Logo}
            alt=""
            width="24"
            height="24"
            className="cursor-pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
          {!isCollapsed && <h1 className="font-bold">Devboard</h1>}
        </div>
      </div>
      <div className="grow">
        <Command>
          <CommandList>
            {menuList.map((menu: any, key: number) => (
              <CommandGroup key={key}>
                {menu.items.map((option: any, optionKey: number) => (
                  <SidebarItem
                    key={optionKey}
                    option={option}
                    isCollapsed={isCollapsed}
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
