"use client"

import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/hooks/use-auth"

export function MobileNav() {
  const { user } = useAuth()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Devboard</SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-3 text-sm">
          <Link href="/" className="font-medium hover:text-foreground">
            Home
          </Link>
          <Link href="/community" className="font-medium hover:text-foreground">
            Community
          </Link>
          {user ? (
            <Link href="/settings" className="font-medium hover:text-foreground">
              Settings
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="font-medium hover:text-foreground">
                Sign In
              </Link>
              <Link href="/sign-up" className="font-medium hover:text-foreground">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
