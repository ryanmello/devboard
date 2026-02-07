import type { Metadata } from "next"

import { Navbar } from "@/components/shared/navbar"
import { ProfilePage } from "@/components/profile/profile-page"
import type { FullUser } from "@/types"

type PageProps = {
  params: Promise<{ username: string }>
}

async function getProfile(username: string): Promise<FullUser | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) return null

  const res = await fetch(`${apiUrl}/api/v1/users/${username}`, {
    cache: "no-store",
  })

  if (!res.ok) return null
  return res.json()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const profile = await getProfile(username)

  if (!profile) {
    return {
      title: "Profile Not Found",
      description: "This developer profile could not be found.",
    }
  }

  const fullName = `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()

  return {
    title: fullName ? `${fullName} · Devboard` : `@${profile.username} · Devboard`,
    description: profile.headline ?? "Developer profile on Devboard.",
  }
}

export default async function ProfilePageRoute({ params }: PageProps) {
  const { username } = await params
  const profile = await getProfile(username)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-12">
        {profile ? (
          <ProfilePage user={profile} />
        ) : (
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            This profile doesn&apos;t exist yet.
          </div>
        )}
      </main>
    </div>
  )
}
