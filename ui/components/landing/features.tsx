"use client"

import { BadgeCheck, Code, Github, GraduationCap, Layers, Trophy } from "lucide-react"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "GitHub Integration",
    description: "Display your contribution heatmap and activity at a glance.",
    icon: Github,
  },
  {
    title: "LeetCode Stats",
    description: "Showcase your problem-solving progress and rankings.",
    icon: Trophy,
  },
  {
    title: "Project Showcase",
    description: "Highlight your best work with links and visuals.",
    icon: Code,
  },
  {
    title: "Experience & Education",
    description: "Share a professional timeline of your journey.",
    icon: GraduationCap,
  },
  {
    title: "Skills Display",
    description: "Present your stack with polished badges.",
    icon: BadgeCheck,
  },
  {
    title: "Custom Profile URL",
    description: "Get a shareable /u/username page for your portfolio.",
    icon: Layers,
  },
]

export function Features() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Everything you need to stand out.
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
            Build a comprehensive, modern developer profile without stitching together multiple platforms.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="shadow-sm">
                <CardHeader>
                  <Icon className="text-primary h-6 w-6" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
