"use client"

import Link from "next/link"

import type { User } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function UserCard({ user }: { user: User }) {
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.trim() || user.username[0]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6 text-center">
        <Avatar className="mx-auto h-16 w-16">
          <AvatarImage src={user.image ?? undefined} alt={user.username} />
          <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
        </Avatar>
        <h3 className="mt-4 text-lg font-semibold">
          {`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username}
        </h3>
        <p className="text-muted-foreground text-sm">@{user.username}</p>
        {user.headline ? (
          <p className="mt-2 text-sm text-muted-foreground">{user.headline}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap justify-center gap-1">
          {user.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/u/${user.username}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
