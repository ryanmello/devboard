"use client"

import {
  Eye,
  LayoutGrid,
  RefreshCw,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react"

const benefits = [
  {
    title: "Stand Out",
    description:
      "Go beyond the resume. Show your real work, code activity, and problem-solving skills in a way that static documents can't.",
    icon: Sparkles,
  },
  {
    title: "All-in-One",
    description:
      "GitHub stats, LeetCode progress, projects, experience, and skills — all unified in a single, polished profile.",
    icon: LayoutGrid,
  },
  {
    title: "Easy to Share",
    description:
      "One link for recruiters, networking events, and social profiles. No more juggling multiple portfolio sites.",
    icon: Share2,
  },
  {
    title: "Always Updated",
    description:
      "Connected integrations keep your stats fresh and accurate without any manual effort on your part.",
    icon: RefreshCw,
  },
  {
    title: "Professional Look",
    description:
      "A thoughtfully designed profile that makes you look polished and prepared, regardless of your experience level.",
    icon: Eye,
  },
  {
    title: "Quick Setup",
    description:
      "Go from sign-up to a published portfolio in under two minutes. No coding or configuration required.",
    icon: Zap,
  },
]

export function Benefits() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Benefits
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Why developers choose Devboard.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Impress recruiters and peers with a portfolio that feels premium by
            default.
          </p>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="group flex gap-4 rounded-xl p-4 transition-colors duration-200 hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
