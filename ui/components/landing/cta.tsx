"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-12 text-center shadow-lg lg:p-16">
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/5" />

          <div className="relative">
            {/* Stats */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold">500+</p>
                <p className="text-xs text-muted-foreground">Developers</p>
              </div>
              <div className="hidden h-8 w-px bg-border sm:block" />
              <div className="text-center">
                <p className="text-2xl font-bold">2K+</p>
                <p className="text-xs text-muted-foreground">
                  Profiles Created
                </p>
              </div>
              <div className="hidden h-8 w-px bg-border sm:block" />
              <div className="text-center">
                <p className="text-2xl font-bold">50K+</p>
                <p className="text-xs text-muted-foreground">Profile Views</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to showcase your work?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Join hundreds of developers who are standing out with Devboard.
              Launch your professional portfolio in minutes, completely free.
            </p>

            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
