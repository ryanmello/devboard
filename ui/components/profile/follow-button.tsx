"use client";

import { UserPlus, UserCheck, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FollowButtonProps {
  isFollowing: boolean;
  isToggling: boolean;
  onToggle: () => void;
}

export function FollowButton({
  isFollowing,
  isToggling,
  onToggle,
}: FollowButtonProps) {
  return (
    <Button
      variant={isFollowing ? "ghost" : "outline"}
      size="sm"
      className="w-full gap-2"
      onClick={onToggle}
      disabled={isToggling}
    >
      {isToggling ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <UserCheck className="h-4 w-4" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
