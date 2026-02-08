"use client"

import { useEffect, useMemo, useState } from "react"

import { Navbar } from "@/components/shared/navbar"
import { PageHeader } from "@/components/shared/page-header"
import { SearchFilters } from "@/components/community/search-filters"
import { UserGrid } from "@/components/community/user-grid"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import type { User } from "@/types"

export default function CommunityPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [skill, setSkill] = useState("")

  const skillOptions = useMemo(() => {
    const set = new Set<string>()
    users.forEach((user) => {
      user.skills.forEach((value) => set.add(value))
    })
    return Array.from(set).sort()
  }, [users])

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    api
      .getUsers({
        search: search || undefined,
        skill: skill || undefined,
        page: "1",
        limit: "24",
      })
      .then((data) => {
        if (!isMounted) return
        setUsers(data)
        setError(null)
      })
      .catch((err: Error) => {
        if (!isMounted) return
        setError(err.message)
        setUsers([])
      })
      .finally(() => {
        if (!isMounted) return
        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [search, skill])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-12">
        <PageHeader
          title="Community"
          description="Browse developers who are building their Devboard profiles."
        />
        <SearchFilters
          search={search}
          skill={skill}
          onSearchChange={setSearch}
          onSkillChange={setSkill}
          skillOptions={skillOptions}
        />
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-56 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            {error}. Check your API connection or try again later.
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No users found. Try adjusting your search or filters.
          </div>
        ) : (
          <UserGrid users={users} />
        )}
      </main>
    </div>
  )
}
