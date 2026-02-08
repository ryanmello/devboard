"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/shared/user-nav"
import { useAuth } from "@/hooks/use-auth"
import { useCurrentUser } from "@/hooks/use-profile"

export function Navbar() {
  const { user, isLoading } = useAuth()
  const { user: currentUser } = useCurrentUser()

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/white.png" alt="Devboard logo" width={32} height={32} />
          <span className="text-3xl font-semibold tracking-tight">Devboard</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/community" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Community
          </Link>
          {!isLoading && !user ? (
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          ) : null}
          {user ? <UserNav /> : null}
        </nav>
      </div>
    </header>
  )
}
