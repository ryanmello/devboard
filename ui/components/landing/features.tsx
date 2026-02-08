"use client"

import {
  BadgeCheck,
  Code,
  Github,
  GraduationCap,
  Layers,
  Trophy,
} from "lucide-react"

const features = [
  {
    title: "GitHub Integration",
    description:
      "Display your contribution heatmap, repos, and coding activity at a glance. Stays in sync automatically.",
    icon: Github,
  },
  {
    title: "LeetCode Stats",
    description:
      "Showcase your problem-solving progress, streaks, and rankings to impress technical recruiters.",
    icon: Trophy,
  },
  {
    title: "Project Showcase",
    description:
      "Highlight your best work with live links, tech stack details, and visual previews.",
    icon: Code,
  },
  {
    title: "Experience & Education",
    description:
      "Share a professional timeline of your career journey and academic achievements.",
    icon: GraduationCap,
  },
  {
    title: "Skills Display",
    description:
      "Present your technical stack with polished, categorized badges that tell your story.",
    icon: BadgeCheck,
  },
  {
    title: "Custom Profile URL",
    description:
      "Get a shareable /u/username page that serves as your professional developer identity.",
    icon: Layers,
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-border py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Features
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to stand out.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Build a comprehensive, modern developer profile without stitching
            together multiple platforms.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-200 group-hover:bg-primary/15">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
