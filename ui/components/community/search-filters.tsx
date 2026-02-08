"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SearchFiltersProps = {
  search: string
  skill: string
  onSearchChange: (value: string) => void
  onSkillChange: (value: string) => void
  skillOptions: string[]
}

export function SearchFilters({
  search,
  skill,
  onSearchChange,
  onSkillChange,
  skillOptions,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="flex w-full flex-col gap-2 md:max-w-md">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search by name, username, or headline"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
    </div>
  )
}
