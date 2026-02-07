"use client"

import type { LeetCodeStats } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function LeetCodeStats({ stats }: { stats: LeetCodeStats | null }) {
  if (!stats) return null

  const total = stats.totalQuestions || 1
  const easyPct = stats.totalEasy ? Math.round((stats.easySolved / stats.totalEasy) * 100) : 0
  const mediumPct = stats.totalMedium ? Math.round((stats.mediumSolved / stats.totalMedium) * 100) : 0
  const hardPct = stats.totalHard ? Math.round((stats.hardSolved / stats.totalHard) * 100) : 0

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">LeetCode Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Solved {stats.totalSolved} / {total}</Badge>
          <Badge variant="secondary">Acceptance {stats.acceptanceRate}%</Badge>
          <Badge variant="secondary">Rank {stats.ranking}</Badge>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <div className="flex justify-between">
              <span>Easy</span>
              <span>{stats.easySolved}/{stats.totalEasy}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary/40" style={{ width: `${easyPct}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <span>Medium</span>
              <span>{stats.mediumSolved}/{stats.totalMedium}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary/60" style={{ width: `${mediumPct}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <span>Hard</span>
              <span>{stats.hardSolved}/{stats.totalHard}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary/80" style={{ width: `${hardPct}%` }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
