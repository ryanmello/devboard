import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { SettingsPage } from "@/components/settings/settings-page"

export default async function SettingsRoute() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/sign-in")
  }

  return <SettingsPage />
}
