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

export function ProfilePage({ user }: { user: FullUser }) {
  const [github, setGithub] = useState<GitHubContributionData | null>(null)
  const [leetcode, setLeetcode] = useState<LeetCodeStats | null>(null)

  useEffect(() => {
    let isMounted = true

    if (user.githubUsername) {
      api.getGitHubData(user.username).then((data) => {
        if (isMounted) setGithub(data)
      })
    }

    if (user.leetcodeUsername) {
      api.getLeetCodeData(user.username).then((data) => {
        if (isMounted) setLeetcode(data)
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
        {user.leetcodeUsername && <LeetCodeStatsCard stats={leetcode} />}
        {user.githubUsername && <GitHubHeatmap data={github} />}
        <ExperienceList experience={user.experience} />
        <EducationList education={user.education} />
        <ProjectsGrid projects={user.projects} />
      </div>
    </div>
  )
}
