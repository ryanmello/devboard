"use client";

import { FullUser } from "@/types";
import { useRouter } from "next/navigation";

const Profile = ({ user }: { user: FullUser | null }) => {
  const router = useRouter();
  
  if (!user) {
    router.push("/sign-in");
  }
  return (
    <div>
      <p>{user?.username}</p>
    </div>
  );
};

export default Profile;
