"use client"

import type { GitHubContributionData } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function getIntensity(count: number) {
  if (count >= 10) return "bg-primary/80"
  if (count >= 5) return "bg-primary/60"
  if (count >= 2) return "bg-primary/40"
  if (count > 0) return "bg-primary/20"
  return "bg-muted"
}

export function GitHubHeatmap({ data }: { data: GitHubContributionData | null }) {
  if (!data) return null

  const days = data.weeks.flatMap((week) => week.contributionDays)

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">GitHub Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {data.totalContributions} contributions in the last year
        </p>
        <div className="grid grid-cols-14 gap-1 sm:grid-cols-20">
          {days.slice(-280).map((day) => (
            <div
              key={day.date}
              className={`h-3 w-3 rounded-sm ${getIntensity(day.contributionCount)}`}
              title={`${day.date}: ${day.contributionCount} contributions`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
