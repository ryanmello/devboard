"use client";

import { Settings, User, Users } from "lucide-react";
import UserItem from "./UserItem";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const menuList = [
    {
      group: "General",
      items: [
        {
          link: "/",
          icon: <User />,
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
    <div className="flex flex-col gap-4 w-[300px] min-w-[300px] border-r min-h-screen p-4">
      <UserItem />
      <div className="grow">
        <Command>
          <CommandList>
            {menuList.map((menu: any, key: number) => (
              <CommandGroup key={key}>
                {menu.items.map((option: any, optionKey: number) => (
                  <div key={optionKey} onClick={() => router.push(option.link)}>
                    <CommandItem className="flex gap-4 cursor-pointer">
                      {option.icon}
                      {option.text}
                    </CommandItem>
                  </div>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </div>
      {/* <div>Settings</div> */}
    </div>
  );
};

export default Sidebar;
