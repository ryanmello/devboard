import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserFooter from "./UserFooter";
import { FullUser } from "@/types";
import Image from "next/image";
import Background from "@/public/whitebg.jpg";
import { cn } from "@/lib/utils";

const UserItem = ({
  currentUser,
  isCollapsed,
}: {
  currentUser: FullUser | null;
  isCollapsed: boolean;
}) => {
  if (currentUser) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1.5",
          !isCollapsed && "border"
        )}
      >
        <Image
          src={Background}
          alt=""
          className="h-6 w-6 rounded-full object-cover"
        />
        {!isCollapsed && (
          <div className="grow">
            <p className="font-bold">{currentUser.firstName}</p>
            <p className="text-sm">@{currentUser.username}</p>
          </div>
        )}
      </div>
    );
  } else {
    return <UserFooter />;
  }
};

export default UserItem;
