"use client"

import { Badge } from "@/components/ui/badge"

const benefits = [
  {
    title: "Stand Out",
    description: "More than just a resume, show your real work and activity.",
  },
  {
    title: "All-in-One",
    description: "GitHub, LeetCode, projects, experience, and skills together.",
  },
  {
    title: "Easy to Share",
    description: "One link for recruiters, networking, and socials.",
  },
  {
    title: "Always Updated",
    description: "Integrations keep your stats fresh and accurate.",
  },
  {
    title: "Professional Look",
    description: "A polished design that makes you look your best.",
  },
]

export function Benefits() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Why developers choose Devboard.
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
            Impress recruiters and peers with a portfolio that feels premium by default.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <Badge variant="secondary">{benefit.title}</Badge>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
