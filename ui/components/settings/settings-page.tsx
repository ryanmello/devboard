"use client"

import { useMemo } from "react"

import { Navbar } from "@/components/shared/navbar"
import { PageHeader } from "@/components/shared/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { OnboardingCard } from "@/components/settings/onboarding-card"
import { ProfileForm } from "@/components/settings/profile-form"
import { SkillsForm } from "@/components/settings/skills-form"
import { ProjectsForm } from "@/components/settings/projects-form"
import { EducationForm } from "@/components/settings/education-form"
import { ExperienceForm } from "@/components/settings/experience-form"
import { useCurrentUser } from "@/hooks/use-profile"
import { ApiError } from "@/lib/api"

export function SettingsPage() {
  const { user, isLoading, error, setUser } = useCurrentUser()

  const isMissingProfile = useMemo(() => {
    return error instanceof ApiError && error.status === 404
  }, [error])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-12">
        <PageHeader
          title="Settings"
          description="Manage your profile, skills, and portfolio details."
        />
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : isMissingProfile ? (
          <OnboardingCard onCreated={setUser} />
        ) : user ? (
          <Tabs defaultValue="profile">
            <TabsList className="w-full flex-wrap justify-start">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <ProfileForm user={user} onUpdated={setUser} />
            </TabsContent>
            <TabsContent value="skills">
              <SkillsForm user={user} onUpdated={setUser} />
            </TabsContent>
            <TabsContent value="projects">
              <ProjectsForm user={user} onUpdated={setUser} />
            </TabsContent>
            <TabsContent value="education">
              <EducationForm user={user} onUpdated={setUser} />
            </TabsContent>
            <TabsContent value="experience">
              <ExperienceForm user={user} onUpdated={setUser} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            We couldn&apos;t load your profile yet. Please refresh or try again later.
          </div>
        )}
      </main>
    </div>
  )
}
