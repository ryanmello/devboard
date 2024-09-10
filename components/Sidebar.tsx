import { Settings, User, Users } from "lucide-react";
import UserItem from "./UserItem";
import {
  Command,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";
import { auth } from "@clerk/nextjs/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import SidebarItem from "./SidebarItem";

const Sidebar = async () => {
  const { userId } = auth();

  const currentUser = await getCurrentUser({clerkId: userId})

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
                  <SidebarItem key={optionKey} option={option} />
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </div>
    </div>
  );
};

export default Sidebar;
