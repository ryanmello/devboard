"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const contributionData = [
  [0, 1, 0, 2, 1, 0, 1],
  [1, 2, 1, 0, 3, 2, 0],
  [2, 0, 3, 1, 2, 0, 1],
  [0, 1, 2, 3, 1, 2, 0],
  [1, 3, 0, 2, 0, 1, 2],
  [2, 1, 2, 0, 1, 3, 2],
  [0, 2, 1, 1, 2, 0, 3],
  [1, 0, 2, 1, 3, 0, 1],
  [2, 1, 0, 3, 2, 1, 0],
  [0, 1, 2, 1, 0, 2, 1],
  [1, 2, 3, 0, 1, 3, 2],
  [3, 2, 1, 2, 3, 2, 1],
  [2, 3, 2, 3, 2, 3, 2],
]

const levelClasses = [
  "bg-muted",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary",
]

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Decorative shapes */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/5" />
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/5" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left content */}
          <div className="space-y-8">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" />
              Developer Portfolio Platform
            </Badge>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Your developer profile,{" "}
                <span className="text-primary">reimagined.</span>
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                Showcase your skills, projects, and coding journey in one
                polished profile that recruiters and peers actually want to
                explore
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  Create Your Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Free to use</span>
              </div>
              <div className="hidden h-4 w-px bg-border sm:block" />
              <span>Setup in 2 minutes</span>
            </div>
          </div>

          {/* Right - Mock profile card */}
          <div className="relative mx-auto max-w-md lg:mx-0 lg:max-w-none">
            <div className="animate-float rounded-2xl border border-border bg-card p-6 shadow-xl">
              {/* Profile header */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  AT
                </div>
                <div>
                  <p className="font-semibold">Alan Turing</p>
                  <p className="text-sm text-muted-foreground">
                    Computer Scientist
                  </p>
                </div>
              </div>

              {/* Contributions & LeetCode side by side */}
              <div className="mt-5 grid grid-cols-[1fr_1.5fr] gap-4">
                {/* Contribution grid */}
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    GitHub
                  </p>
                  <div className="flex gap-[3px]">
                    {contributionData.map((week, i) => (
                      <div key={i} className="flex flex-col gap-[3px]">
                        {week.map((level, j) => (
                          <div
                            key={j}
                            className={`h-2.5 w-2.5 rounded-sm ${levelClasses[level]}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* LeetCode mini stats */}
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    LeetCode
                  </p>
                  <div className="flex items-center gap-4">
                    {/* Progress ring */}
                    <div className="relative flex shrink-0 items-center justify-center">
                      <svg width={64} height={64} className="-rotate-90">
                        <circle
                          cx={32}
                          cy={32}
                          r={27}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={5}
                          className="text-muted"
                        />
                        <circle
                          cx={32}
                          cy={32}
                          r={27}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={5}
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 27}
                          strokeDashoffset={2 * Math.PI * 27 * (1 - 96 / 150)}
                          className="text-primary"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-sm font-bold leading-none">96</span>
                        <span className="text-[8px] text-muted-foreground">solved</span>
                      </div>
                    </div>
                    {/* Difficulty bars */}
                    <div className="flex-1 space-y-1.5">
                      {[
                        { label: "Easy", color: "#22c55e", solved: 53, pct: 55 },
                        { label: "Medium", color: "#f59e0b", solved: 34, pct: 35 },
                        { label: "Hard", color: "#ef4444", solved: 9, pct: 10 },
                      ].map(({ label, color, solved, pct }) => (
                        <div key={label}>
                          <div className="mb-0.5 flex items-center justify-between">
                            <span className="text-[11px] font-medium" style={{ color }}>
                              {label}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{solved}</span>
                          </div>
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech stack */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["React", "TypeScript", "Node.js", "Python", "PostgreSQL"].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-3 gap-4 border-t border-border pt-4">
                <div>
                  <p className="text-lg font-bold">142</p>
                  <p className="text-xs text-muted-foreground">Repositories</p>
                </div>
                <div>
                  <p className="text-lg font-bold">1.2K</p>
                  <p className="text-xs text-muted-foreground">
                    Contributions
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold">96</p>
                  <p className="text-xs text-muted-foreground">Problems</p>
                </div>
              </div>
            </div>

            {/* Floating accent */}
            <div className="absolute -right-3 -top-3 hidden rounded-lg border border-border bg-card px-3 py-1.5 shadow-lg sm:block">
              <p className="text-xs font-medium text-green-600">
                +28 this week
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
