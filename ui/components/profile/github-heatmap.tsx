"use client"

import type { GitHubContributionData } from "@/types"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

function getOuterColor(count: number) {
  if (count >= 7) return "bg-green-300 hover:bg-green-200"
  if (count >= 5) return "bg-green-400 hover:bg-green-300"
  if (count >= 3) return "bg-green-500 hover:bg-green-400"
  if (count >= 1) return "bg-green-600 hover:bg-green-500"
  return "bg-neutral-700 hover:bg-neutral-600"
}

function getInnerColor(count: number) {
  if (count >= 7) return "bg-green-400"
  if (count >= 5) return "bg-green-500"
  if (count >= 3) return "bg-green-600"
  if (count >= 1) return "bg-green-700"
  return "bg-neutral-600"
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function Cell({ count, date }: { count: number; date: string }) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "size-[13px] xl:size-[15px] rounded-sm flex items-center justify-center",
              "transition-transform duration-200 ease-in-out hover:scale-110",
              getOuterColor(count)
            )}
          >
            <div
              className={cn(
                "size-[11px] xl:size-[13px] rounded-sm",
                "transition-colors duration-200 ease-in-out",
                getInnerColor(count)
              )}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">
            <span className="font-semibold">{count}</span>{" "}
            {count === 1 ? "contribution" : "contributions"} on{" "}
            {formatDate(date)}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const SKELETON_CELLS = Array.from({ length: 52 * 7 }, (_, i) => i)

export function GitHubHeatmap({ data }: { data: GitHubContributionData | null }) {
  const loading = !data
  const days = data?.weeks.flatMap((week) => week.contributionDays) ?? []

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">GitHub Activity</CardTitle>
          {loading ? (
            <span className="h-4 w-32 animate-pulse rounded bg-muted" />
          ) : (
            <span className="text-sm font-medium text-muted-foreground">
              {data.totalContributions.toLocaleString()} contributions
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[110px] xl:max-h-[125px] flex flex-col flex-wrap gap-[2px] overflow-x-clip">
          {loading
            ? SKELETON_CELLS.map((i) => (
                <div
                  key={i}
                  className="size-[13px] xl:size-[15px] rounded-sm bg-neutral-700 animate-pulse"
                  style={{ animationDelay: `${(i % 7) * 75}ms` }}
                />
              ))
            : days.map((day) => (
                <Cell
                  key={day.date}
                  count={day.contributionCount}
                  date={day.date}
                />
              ))}
        </div>
        <div className="flex items-center justify-end gap-1.5 mt-3 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="size-[11px] rounded-sm bg-neutral-600" />
          <div className="size-[11px] rounded-sm bg-green-700" />
          <div className="size-[11px] rounded-sm bg-green-600" />
          <div className="size-[11px] rounded-sm bg-green-500" />
          <div className="size-[11px] rounded-sm bg-green-400" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}
