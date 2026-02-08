"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to showcase your work?
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-sm sm:text-base">
            Join developers who are standing out with Devboard. Launch your portfolio in minutes.
          </p>
          <div className="mt-6 flex items-center justify-center">
            <Button size="lg" asChild>
              <Link href="/sign-up">Create Your Free Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
