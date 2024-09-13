import getCurrentUser from "@/app/actions/getCurrentUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@clerk/nextjs/server";

const UserItem = async () => {
  const { userId } = auth();
  const currentUser = await getCurrentUser({ clerkId: userId });

  console.log(currentUser);

  if (currentUser) {
    return (
      <div className="flex items-center gap-2 border rounded-md p-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="grow">
          <p className="font-bold">{currentUser.firstName}</p>
          <p className="text-sm">@{currentUser.username}</p>
        </div>
      </div>
    );
  }
};

export default UserItem;
