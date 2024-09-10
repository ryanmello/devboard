import { Bell, CreditCard, Inbox, User } from "lucide-react";
import UserItem from "./UserItem";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const Sidebar = () => {
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
          link: "/inbox",
          icon: <Inbox />,
          text: "Inbox",
        },
        {
          link: "/billing",
          icon: <CreditCard />,
          text: "Billing",
        },
        {
          link: "/notifications",
          icon: <Bell />,
          text: "Notifications",
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
                  <CommandItem key={optionKey} className="flex gap-4 cursor-pointer">
                    {option.icon}
                    {option.text}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </div>
      <div>Settings</div>
    </div>
  );
};

export default Sidebar;
