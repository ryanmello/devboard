"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 text-left">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Developer portfolio, reimagined
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Your developer portfolio, simplified.
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base sm:text-lg">
            Devboard helps you showcase your skills, projects, and coding journey in one beautiful profile that recruiters and peers love to explore.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg" asChild>
            <Link href="/sign-up">
              Create Your Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
