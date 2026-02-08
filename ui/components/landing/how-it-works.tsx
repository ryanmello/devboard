"use client"

import { Rocket, Share2, UserPlus } from "lucide-react"

const steps = [
  {
    title: "Sign Up",
    description:
      "Create your account with GitHub or Google. It takes less than 30 seconds to get started.",
    icon: UserPlus,
  },
  {
    title: "Build Your Profile",
    description:
      "Add projects, experience, skills, and connect your GitHub and LeetCode integrations.",
    icon: Rocket,
  },
  {
    title: "Share Everywhere",
    description:
      "Get your unique profile URL and share it with recruiters, on LinkedIn, or anywhere you need.",
    icon: Share2,
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-border py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            How It Works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Up and running in minutes.
          </h2>
          <p className="mt-4 text-muted-foreground">
            A simple three-step workflow to get your portfolio live and looking
            great.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connecting line between steps */}
          <div className="absolute left-[16.7%] right-[16.7%] top-10 hidden h-px border-t-2 border-dashed border-primary/30 sm:block" />

          <div className="grid gap-10 sm:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="relative text-center">
                  <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-background">
                    <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
