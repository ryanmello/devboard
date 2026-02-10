"use client"

import { useEffect, useRef, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Camera, FileText, Upload, RefreshCw, Trash2 } from "lucide-react"

import type { FullUser } from "@/types"
import { api } from "@/lib/api"
import {
  uploadResume,
  deleteResume,
  validateResumeFile,
  uploadImage,
  validateImageFile,
  deleteImage,
} from "@/lib/storage"
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
  resume: z.string().url().optional().or(z.literal("")),
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
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

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

  const resumeUrl = form.watch("resume")
  const profileImageUrl = form.watch("image")

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

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      validateResumeFile(file)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid file.")
      return
    }

    setIsUploading(true)
    try {
      const publicUrl = await uploadResume(user.id, user.username, file)
      form.setValue("resume", publicUrl, { shouldDirty: true })
      toast.success("Resume uploaded. Click Save changes to apply.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  function handleRemoveResume() {
    form.setValue("resume", "", { shouldDirty: true })
  }

  async function handleProfileImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      validateImageFile(file)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid file.")
      return
    }

    setIsUploadingImage(true)
    try {
      const publicUrl = await uploadImage(user.id, "profile", file)
      form.setValue("image", publicUrl, { shouldDirty: true })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setIsUploadingImage(false)
      if (imageInputRef.current) imageInputRef.current.value = ""
    }
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSaving(true)
    try {
      // If the user had a resume and it's now cleared, delete from storage
      if (user.resume && !values.resume) {
        await deleteResume(user.id, user.username)
      }
      // If the profile image was removed, delete from storage
      if (user.image && !values.image) {
        await deleteImage(user.image)
      }

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
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Avatar + name/username row */}
          <div className="flex gap-6">
            {/* Profile photo */}
            <div className="flex flex-col items-center gap-2">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleProfileImageSelect}
                disabled={isUploadingImage}
              />
              <button
                type="button"
                disabled={isUploadingImage}
                onClick={() => imageInputRef.current?.click()}
                className="group relative h-36 w-36 shrink-0 cursor-pointer overflow-hidden rounded-full border-2 border-border transition-colors hover:border-primary/50 disabled:pointer-events-none disabled:opacity-50"
              >
                {profileImageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <Camera className="h-5 w-5 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <Camera className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </div>
                )}
              </button>
            </div>

            {/* Name + username fields */}
            <div className="flex-1 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" {...form.register("firstName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" {...form.register("lastName")} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={user.username} disabled />
                <p className="text-xs text-muted-foreground">
                  Username changes are currently disabled.
                </p>
              </div>
            </div>
          </div>

          {/* Remaining fields in 2-col grid */}
          <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="headline">Headline</Label>
            <Textarea id="headline" rows={3} {...form.register("headline")} />
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
          {/* Resume upload */}
          <div className="space-y-2 sm:col-span-2">
            <Label>Resume</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            {resumeUrl ? (
              <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/50 px-3 py-2">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:underline truncate"
                >
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {user.username}_resume.pdf
                </a>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    title="Replace resume"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    onClick={handleRemoveResume}
                    title="Remove resume"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border px-3 py-10 text-sm transition-colors hover:border-primary/50 hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-50"
              >
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {isUploading ? "Uploading..." : "Upload PDF (max 5 MB)"}
                </span>
              </button>
            )}
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
