"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import type { FullUser } from "@/types"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  headline: z.string().max(120, "Headline must be 120 characters or fewer.").optional(),
  image: z.string().url("Enter a valid image URL.").optional().or(z.literal("")),
  resume: z.string().url("Enter a valid resume URL.").optional().or(z.literal("")),
  githubUsername: z.string().optional(),
  leetcodeUsername: z.string().optional(),
  linkedinUsername: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function ProfileForm({
  user,
  onUpdated,
}: {
  user: FullUser
  onUpdated: (user: FullUser) => void
}) {
  const [isSaving, setIsSaving] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      headline: user.headline ?? "",
      image: user.image ?? "",
      resume: user.resume ?? "",
      githubUsername: user.githubUsername ?? "",
      leetcodeUsername: user.leetcodeUsername ?? "",
      linkedinUsername: user.linkedinUsername ?? "",
    },
  })

  useEffect(() => {
    form.reset({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      headline: user.headline ?? "",
      image: user.image ?? "",
      resume: user.resume ?? "",
      githubUsername: user.githubUsername ?? "",
      leetcodeUsername: user.leetcodeUsername ?? "",
      linkedinUsername: user.linkedinUsername ?? "",
    })
  }, [form, user])

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSaving(true)
    try {
      const updated = await api.updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        headline: values.headline,
        image: values.image,
        resume: values.resume,
        githubUsername: values.githubUsername,
        leetcodeUsername: values.leetcodeUsername,
        linkedinUsername: values.linkedinUsername,
      })
      toast.success("Profile updated.")
      onUpdated({ ...user, ...updated })
    } catch (error) {
      toast.error("Failed to update profile.")
    } finally {
      setIsSaving(false)
    }
  })

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" {...form.register("firstName")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" {...form.register("lastName")} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={user.username} disabled />
            <p className="text-xs text-muted-foreground">
              Username changes are currently disabled.
            </p>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="headline">Headline</Label>
            <Textarea id="headline" rows={3} {...form.register("headline")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Profile image URL</Label>
            <Input id="image" {...form.register("image")} />
            {form.formState.errors.image ? (
              <p className="text-xs text-destructive">{form.formState.errors.image.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume">Resume URL</Label>
            <Input id="resume" {...form.register("resume")} />
            {form.formState.errors.resume ? (
              <p className="text-xs text-destructive">{form.formState.errors.resume.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUsername">GitHub username</Label>
            <Input id="githubUsername" {...form.register("githubUsername")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leetcodeUsername">LeetCode username</Label>
            <Input id="leetcodeUsername" {...form.register("leetcodeUsername")} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="linkedinUsername">LinkedIn username</Label>
            <Input id="linkedinUsername" {...form.register("linkedinUsername")} />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
