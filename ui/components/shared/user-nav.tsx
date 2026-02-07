"use client"

import Link from "next/link"
import { LogOut, Settings, User } from "lucide-react"

import { useAuth } from "@/hooks/use-auth"
import { useCurrentUser } from "@/hooks/use-profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserNav() {
  const { user, signOut, isLoading } = useAuth()
  const { user: currentUser } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="h-9 w-9 animate-pulse rounded-full bg-muted" aria-hidden />
    )
  }

  if (!user) {
    return null
  }

  const initials =
    user.user_metadata?.full_name?.[0]?.toUpperCase() ??
    user.email?.[0]?.toUpperCase() ??
    "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full p-0">
          <Avatar>
            <AvatarImage src={user.user_metadata?.avatar_url} alt="User avatar" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {currentUser?.username ? (
          <DropdownMenuItem asChild>
            <Link href={`/u/${currentUser.username}`} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-destructive">
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
