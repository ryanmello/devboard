"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const steps = [
  {
    title: "Sign Up",
    description: "Create your account with GitHub or Google in seconds.",
  },
  {
    title: "Build Your Profile",
    description: "Add projects, experience, and connect integrations.",
  },
  {
    title: "Share",
    description: "Get a unique profile URL to send anywhere.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            How it works.
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
            A simple workflow that keeps your portfolio current and impressive.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step.title} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  {index + 1}. {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {step.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
