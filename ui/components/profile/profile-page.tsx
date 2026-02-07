"use client"

import { useEffect, useState } from "react"

import type { FullUser, GitHubContributionData, LeetCodeStats } from "@/types"
import { api } from "@/lib/api"
import { ProfileHeader } from "@/components/profile/profile-header"
import { SkillsSection } from "@/components/profile/skills-section"
import { GitHubHeatmap } from "@/components/profile/github-heatmap"
import { LeetCodeStats as LeetCodeStatsCard } from "@/components/profile/leetcode-stats"
import { ProjectsGrid } from "@/components/profile/projects-grid"
import { ExperienceList } from "@/components/profile/experience-list"
import { EducationList } from "@/components/profile/education-list"
import { Skeleton } from "@/components/ui/skeleton"

export function ProfilePage({ user }: { user: FullUser }) {
  const [github, setGithub] = useState<GitHubContributionData | null>(null)
  const [leetcode, setLeetcode] = useState<LeetCodeStats | null>(null)
  const [loadingGithub, setLoadingGithub] = useState(true)
  const [loadingLeetCode, setLoadingLeetCode] = useState(true)

  useEffect(() => {
    let isMounted = true

    if (!user.githubUsername) {
      setLoadingGithub(false)
    } else {
      api
        .getGitHubData(user.username)
        .then((data) => {
          if (!isMounted) return
          setGithub(data)
        })
        .finally(() => {
          if (!isMounted) return
          setLoadingGithub(false)
        })
    }

    if (!user.leetcodeUsername) {
      setLoadingLeetCode(false)
    } else {
      api
        .getLeetCodeData(user.username)
        .then((data) => {
          if (!isMounted) return
          setLeetcode(data)
        })
        .finally(() => {
          if (!isMounted) return
          setLoadingLeetCode(false)
        })
    }

    return () => {
      isMounted = false
    }
  }, [user.githubUsername, user.leetcodeUsername, user.username])

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="space-y-6">
        <ProfileHeader user={user} />
        <SkillsSection skills={user.skills} />
      </div>
      <div className="space-y-6">
        {loadingLeetCode ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <LeetCodeStatsCard stats={leetcode} />
        )}
        {loadingGithub ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <GitHubHeatmap data={github} />
        )}
        <ProjectsGrid projects={user.projects} />
        <ExperienceList experience={user.experience} />
        <EducationList education={user.education} />
      </div>
    </div>
  )
}
