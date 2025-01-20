import UserFooter from "./UserFooter";
import { FullUser } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
          "flex justify-center gap-2 rounded-md",
          !isCollapsed && "border px-2 py-1.5"
        )}
      >
        {currentUser.image ? (
          <Image
            src={currentUser.image}
            alt="image"
            width={100}
            height={100}
            className={cn("h-8 w-8 object-cover rounded-md border mt-1")}
          />
        ) : (
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 bg-primary-foreground rounded-md border mt-1",
              isCollapsed && "w-6 h-6"
            )}
          />
        )}
        {!isCollapsed && (
          <div className="grow">
            <p className="font-bold truncate">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p className="text-sm truncate">@{currentUser.username}</p>
          </div>
        )}
      </div>
    );
  } else {
    return <UserFooter isCollapsed={isCollapsed} />;
  }
};

export default UserItem;
