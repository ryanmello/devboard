import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserItem = () => {
  return (
    <div className="flex items-center gap-2 border rounded-md p-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="grow">
        <p className="font-bold">Ryan Mello</p>
        <p className="text-sm">@ryanmello</p>
      </div>
    </div>
  );
};

export default UserItem;
