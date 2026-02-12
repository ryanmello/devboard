"use client";

import type { LeetCodeStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const difficulties = [
  { key: "easy", label: "Easy", color: "#22c55e" },
  { key: "medium", label: "Medium", color: "#f59e0b" },
  { key: "hard", label: "Hard", color: "#ef4444" },
] as const;

function ProgressRing({ solved, total }: { solved: number; total: number }) {
  const radius = 68;
  const stroke = 9;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const pct = total > 0 ? solved / total : 0;
  const offset = circumference - pct * circumference;

  return (
    <div className="relative flex shrink-0 items-center justify-center">
      <svg width={radius * 2} height={radius * 2} className="-rotate-90">
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted"
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary transition-all duration-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold leading-none">{solved}</span>
        <span className="text-muted-foreground mt-1 text-[10px] uppercase tracking-wider">
          solved
        </span>
      </div>
    </div>
  );
}

export function LeetCodeStats({ stats }: { stats: LeetCodeStats | null }) {
  const loading = !stats;

  const solvedMap = stats
    ? {
        easy: { solved: stats.easySolved, total: stats.totalEasy },
        medium: { solved: stats.mediumSolved, total: stats.totalMedium },
        hard: { solved: stats.hardSolved, total: stats.totalHard },
      }
    : null;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">LeetCode</CardTitle>
        {loading ? (
          <div className="flex items-center gap-3">
            <span className="h-3.5 w-20 animate-pulse rounded bg-muted" />
            <span className="h-3.5 w-16 animate-pulse rounded bg-muted" />
          </div>
        ) : (
          <div className="text-muted-foreground flex items-center gap-3 text-xs">
            <span>
              Acceptance{" "}
              <span className="text-foreground font-medium">
                {stats.acceptanceRate}%
              </span>
            </span>
            <span>
              Rank{" "}
              <span className="text-foreground font-medium">
                {stats.ranking.toLocaleString()}
              </span>
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          {loading ? (
            <ProgressRingSkeleton />
          ) : (
            <ProgressRing
              solved={stats.totalSolved}
              total={stats.totalQuestions}
            />
          )}
          <div className="flex-1 space-y-3">
            {difficulties.map(({ key, label, color }) => {
              if (loading) {
                return (
                  <div key={key}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="h-3.5 w-12 animate-pulse rounded bg-muted" />
                      <span className="h-3 w-6 animate-pulse rounded bg-muted" />
                    </div>
                    <div className="bg-muted h-2 overflow-hidden rounded-full">
                      <div className="h-full w-full animate-pulse rounded-full bg-muted-foreground/10" />
                    </div>
                  </div>
                );
              }
              const { solved } = solvedMap![key];
              const pct =
                stats.totalSolved > 0
                  ? Math.round((solved / stats.totalSolved) * 100)
                  : 0;
              return (
                <div key={key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium" style={{ color }}>
                      {label}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {solved}
                    </span>
                  </div>
                  <div className="bg-muted h-2 overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressRingSkeleton() {
  const radius = 68;
  const stroke = 9;
  const normalizedRadius = radius - stroke / 2;

  return (
    <div className="relative flex shrink-0 items-center justify-center animate-pulse">
      <svg width={radius * 2} height={radius * 2} className="-rotate-90">
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted"
        />
      </svg>
      <div className="absolute flex flex-col items-center gap-1.5">
        <span className="h-6 w-8 rounded bg-muted" />
        <span className="h-2.5 w-10 rounded bg-muted" />
      </div>
    </div>
  );
}
