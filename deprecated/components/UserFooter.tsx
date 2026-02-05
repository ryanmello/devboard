"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const UserFooter = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const router = useRouter();

  return (
    <div>
      <div
        className={cn(
          "flex gap-1 text-sm font-medium",
          isCollapsed && "hidden"
        )}
      >
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

      {isCollapsed && (
        <div
          onClick={() => router.push("/sign-in")}
          className="flex items-center justify-center rounded-md px-2 py-1.5 cursor-pointer hover:bg-primary-foreground"
        >
          <ArrowRight />
        </div>
      )}
    </div>
  );
};

export default UserFooter;
