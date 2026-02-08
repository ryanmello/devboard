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
        <UserGrid users={users} />
      </main>
    </div>
  )
}
