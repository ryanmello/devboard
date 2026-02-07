"use client"

import type { User } from "@/types"
import { UserCard } from "@/components/community/user-card"

export function UserGrid({ users }: { users: User[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
