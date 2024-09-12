"use client";

import { useRouter } from "next/navigation";

const UserFooter = () => {
  const router = useRouter();

  return (
    <div className="flex gap-1 text-sm font-medium">
      <div
        onClick={() => router.push("/sign-in")}
        className="flex items-center justify-center p-2 rounded-md border w-1/3 cursor-pointer hover:bg-primary-foreground"
      >
        <p>Sign in</p>
      </div>
      <div
        onClick={() => router.push("/sign-up")}
        className="flex items-center justify-center p-2 rounded-md border w-2/3 cursor-pointer hover:bg-primary-foreground"
      >
        <p>Create an account</p>
      </div>
    </div>
  );
};

export default UserFooter;
