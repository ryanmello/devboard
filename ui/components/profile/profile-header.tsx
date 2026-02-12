"use client";

import Link from "next/link";
import { Globe, Linkedin, Github, FileText, Code } from "lucide-react";

import type { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FollowListDialog } from "@/components/profile/follow-list-dialog";

interface ProfileHeaderProps {
  user: User;
  followerCount: number;
  followingCount: number;
  followLoading: boolean;
}

export function ProfileHeader({
  user,
  followerCount,
  followingCount,
  followLoading,
}: ProfileHeaderProps) {
  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.trim() ||
    user.username[0];
  const fullName =
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username;

  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col items-start gap-4">
        <div className="flex w-full items-start gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.image ?? undefined} alt={user.username} />
            <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h1 className="text-2xl font-semibold">{fullName}</h1>
            <p className="text-muted-foreground text-sm">@{user.username}</p>
            {user.headline ? (
              <p className="text-sm text-muted-foreground">{user.headline}</p>
            ) : null}
            {!followLoading && (
              <div className="flex gap-4 text-sm pt-1">
                <FollowListDialog
                  username={user.username}
                  type="followers"
                  count={followerCount}
                  trigger={
                    <button className="hover:underline cursor-pointer">
                      <span className="font-semibold">{followerCount}</span>{" "}
                      <span className="text-muted-foreground">followers</span>
                    </button>
                  }
                />
                <FollowListDialog
                  username={user.username}
                  type="following"
                  count={followingCount}
                  trigger={
                    <button className="hover:underline cursor-pointer">
                      <span className="font-semibold">{followingCount}</span>{" "}
                      <span className="text-muted-foreground">following</span>
                    </button>
                  }
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {user.linkedinUsername ? (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`https://linkedin.com/in/${user.linkedinUsername}`}
                className="gap-1"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin className="size-3" />
                LinkedIn
              </Link>
            </Button>
          ) : null}
          {user.githubUsername ? (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`https://github.com/${user.githubUsername}`}
                className="gap-1"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="size-3" />
                GitHub
              </Link>
            </Button>
          ) : null}
          {user.leetcodeUsername ? (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`https://leetcode.com/${user.leetcodeUsername}`}
                className="gap-1"
                target="_blank"
                rel="noreferrer"
              >
                <Code className="size-3" />
                LeetCode
              </Link>
            </Button>
          ) : null}
          {user.resume ? (
            <Button size="sm" asChild>
              <Link href={user.resume} target="_blank" rel="noreferrer">
                <FileText className="size-3" />
                Resume
              </Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
