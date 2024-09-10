"use client";

import { useRouter } from "next/navigation";
import { CommandItem } from "./ui/command";

const SidebarItem = ({ option }: { option: any }) => {
  const router = useRouter();
  
  return (
    <div onClick={() => router.push(option.link)}>
      <CommandItem className="flex gap-4 cursor-pointer">
        {option.icon}
        {option.text}
      </CommandItem>
    </div>
  );
};

export default SidebarItem;
