"use client"

import Link from "next/link"
import { Globe, Linkedin, Github, FileText } from "lucide-react"

import type { User } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function ProfileHeader({ user }: { user: User }) {
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.trim() || user.username[0]
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username

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
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {user.githubUsername ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`https://github.com/${user.githubUsername}`} target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
                GitHub
              </Link>
            </Button>
          ) : null}
          {user.linkedinUsername ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`https://linkedin.com/in/${user.linkedinUsername}`} target="_blank" rel="noreferrer">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Link>
            </Button>
          ) : null}
          {user.leetcodeUsername ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`https://leetcode.com/${user.leetcodeUsername}`} target="_blank" rel="noreferrer">
                <Globe className="h-4 w-4" />
                LeetCode
              </Link>
            </Button>
          ) : null}
          {user.resume ? (
            <Button size="sm" asChild>
              <Link href={user.resume} target="_blank" rel="noreferrer">
                <FileText className="h-4 w-4" />
                Resume
              </Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
