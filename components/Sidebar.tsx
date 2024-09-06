import UserItem from "./UserItem";
import {
  Command,
  CommandEmpty,
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
          text: "Profile",
        },
        {
          link: "/inbox",
          text: "Inbox",
        },
        {
          link: "/billing",
          text: "Billing",
        },
        {
          link: "/notifications",
          text: "Notifications",
        },
      ],
    },
    {
      group: "Settings",
      items: [
        {
          link: "/",
          text: "Settings",
        },
        {
          link: "/privacy",
          text: "Privacy",
        },
        {
          link: "/logs",
          text: "Logs",
        },
      ],
    },
  ];

  // https://www.youtube.com/watch?v=mju7e6Cf6Nk&list=PL8HkCX2C5h0VGhZnfbwf2hq7yD7nXMbJJ&index=3

  return (
    <div className="flex flex-col gap-4 w-[300px] min-w-[300px] border-r min-h-screen p-4">
      <UserItem />
      <div className="grow">
        <Command>
          <CommandList>
            {menuList.map((menu: any, key: number) => (
              <CommandGroup key={key} heading={menu.group}>
                {menu.items.map((option: any, optionKey: number) => (
                  <CommandItem key={optionKey}>{option.text}</CommandItem>
                ))}
              </CommandGroup>
            ))}
            <CommandSeparator />
          </CommandList>
        </Command>
      </div>
      <div>Settings</div>
    </div>
  );
};

export default Sidebar;
