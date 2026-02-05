"use client";

import { useRouter } from "next/navigation";
import { CommandItem } from "./ui/command";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const SidebarItem = ({
  option,
  isCollapsed,
  className,
}: {
  option: any;
  isCollapsed: boolean;
  className?: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      onClick={() => router.push(option.link)}
      className={`sidebar-item ${className}`}
    >
      <CommandItem
        className={cn(
          "flex gap-4 cursor-pointer hover:bg-primary-foreground",
          pathname == option.link && "bg-primary-foreground"
        )}
      >
        {option.icon}
        {!isCollapsed && <>{option.text}</>}
      </CommandItem>
    </div>
  );
};

export default SidebarItem;
