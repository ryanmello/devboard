import { ContactRound, Home, Settings, User, Users } from "lucide-react";
import UserItem from "./UserItem";
import { Command, CommandGroup, CommandList } from "@/components/ui/command";
import { auth } from "@clerk/nextjs/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import SidebarItem from "./SidebarItem";
import Image from "next/image";
import Logo from "@/public/white.png";

const Sidebar = async () => {
  const { userId } = auth();

  const currentUser = await getCurrentUser({ clerkId: userId });

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
    <div className="flex flex-col gap-4 w-[260px] min-w-[260px] border-r min-h-screen p-4">
      <div className="flex items-center gap-2 px-2">
        <Image src={Logo} alt="" width="20" height="20" />
        <h1 className="font-bold text-lg">Devboard</h1>
      </div>
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
      <UserItem />
    </div>
  );
};

export default Sidebar;
