"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import type { User } from "@/types";
import { api } from "@/lib/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FollowListDialogProps {
  username: string;
  type: "followers" | "following";
  count: number;
  trigger: React.ReactNode;
}

export function FollowListDialog({
  username,
  type,
  count,
  trigger,
}: FollowListDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);

    const fetcher = type === "followers" ? api.getFollowers : api.getFollowing;

    fetcher(username, 1, 50)
      .then((data) => {
        if (isMounted) {
          setUsers(data.users);
        }
      })
      .catch((err) => {
        console.error(`Failed to fetch ${type}:`, err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, username, type]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "followers" ? "Followers" : "Following"} ({count})
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-80 space-y-1 overflow-y-auto">
          {isLoading ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Loading...
            </p>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              {type === "followers"
                ? "No followers yet."
                : "Not following anyone yet."}
            </p>
          ) : (
            users.map((u) => (
              <Link
                key={u.id}
                href={`/u/${u.username}`}
                className="flex items-center gap-3 rounded-md p-2 hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={u.image ?? undefined} alt={u.username} />
                  <AvatarFallback>{u.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {u.firstName && u.lastName
                      ? `${u.firstName} ${u.lastName}`
                      : u.username}
                  </p>
                  <p className="text-xs text-muted-foreground">@{u.username}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
