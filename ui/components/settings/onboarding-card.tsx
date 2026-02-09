"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { api } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import type { FullUser } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const schema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(39, "Username must be 39 characters or fewer.")
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/, "Use letters, numbers, and hyphens only."),
})

type FormValues = z.infer<typeof schema>

export function OnboardingCard({ onCreated }: { onCreated: (user: FullUser) => void }) {
  const { user } = useAuth()
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    if (!user?.email) {
      toast.error("Missing email for profile creation.")
      return
    }

    setIsSaving(true)
    try {
      const created = await api.createUser({
        username: values.username,
        email: user.email,
        image: user.user_metadata?.avatar_url || undefined,
      })
      toast.success("Profile created. Let's finish it up.")
      onCreated({ ...(created as FullUser), projects: [], education: [], experience: [] })
    } catch (error) {
      toast.error("Failed to create profile. Please try another username.")
    } finally {
      setIsSaving(false)
    }
  })

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Create your profile</CardTitle>
        <CardDescription>
          Pick a unique username to start building your Devboard profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" {...form.register("username")} placeholder="your-handle" />
            {form.formState.errors.username ? (
              <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>
            ) : null}
          </div>
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? "Creating..." : "Create Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
