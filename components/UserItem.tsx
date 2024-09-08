import UserFooter from "./UserFooter";
import { FullUser } from "@/types";
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
          "flex gap-2 rounded-md px-2 py-1.5",
          !isCollapsed && "border"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 bg-primary-foreground rounded-md border mt-1",
            isCollapsed && "w-6 h-6"
          )}
        />
        {!isCollapsed && (
          <div className="grow">
            <p className="font-bold">
              {currentUser.firstName} {currentUser.lastName}
            </p>
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
