"use client"

import { useEffect, useMemo, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"

import type { Experience, FullUser } from "@/types"
import { api } from "@/lib/api"
import { deleteImage } from "@/lib/storage"
import { sortExperience } from "@/lib/utils"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/shared/image-upload"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 50 }, (_, i) => String(currentYear - i))

const employmentTypes = [
  "Full-time",
  "Part-time",
  "Self-employed",
  "Freelance",
  "Contract",
  "Internship",
  "Apprenticeship",
  "Seasonal",
] as const

const schema = z.object({
  company: z.string().min(1, "Company is required."),
  companyImage: z.string().url("Enter a valid URL.").optional().or(z.literal("")),
  title: z.string().min(1, "Job title is required."),
  startMonth: z.string().min(1, "Start month is required."),
  startYear: z.string().min(4, "Start year is required."),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
  isCurrent: z.boolean().optional(),
  location: z.string().optional(),
  employmentType: z.string().optional(),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function ExperienceForm({
  user,
  onUpdated,
}: {
  user: FullUser
  onUpdated: (user: FullUser) => void
}) {
  const [items, setItems] = useState<Experience[]>(user.experience ?? [])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      company: "",
      companyImage: "",
      title: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      isCurrent: false,
      location: "",
      employmentType: "",
      description: "",
    },
  })

  const isCurrent = form.watch("isCurrent") ?? false
  const sortedItems = useMemo(() => sortExperience(items), [items])

  useEffect(() => {
    setItems(user.experience ?? [])
  }, [user.experience])

  const startEdit = (experience: Experience) => {
    setEditingId(experience.id)
    form.reset({
      company: experience.company,
      companyImage: experience.companyImage ?? "",
      title: experience.title,
      startMonth: experience.startMonth,
      startYear: experience.startYear,
      endMonth: experience.endMonth ?? "",
      endYear: experience.endYear ?? "",
      isCurrent: experience.isCurrent,
      location: experience.location ?? "",
      employmentType: experience.employmentType ?? "",
      description: experience.description ?? "",
    })
  }

  const resetForm = () => {
    setEditingId(null)
    form.reset({
      company: "",
      companyImage: "",
      title: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      isCurrent: false,
      location: "",
      employmentType: "",
      description: "",
    })
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSaving(true)
    try {
      const payload = {
        ...values,
        endMonth: values.isCurrent ? undefined : values.endMonth,
        endYear: values.isCurrent ? undefined : values.endYear,
      }
      if (editingId) {
        const existing = items.find((item) => item.id === editingId)
        if (existing?.companyImage && existing.companyImage !== values.companyImage) {
          await deleteImage(existing.companyImage)
        }
        const updated = await api.updateExperience(editingId, payload)
        const next = items.map((item) => (item.id === updated.id ? updated : item))
        setItems(next)
        onUpdated({ ...user, experience: next })
        toast.success("Experience updated.")
      } else {
        const created = await api.createExperience(payload)
        const next = [created, ...items]
        setItems(next)
        onUpdated({ ...user, experience: next })
        toast.success("Experience added.")
      }
      resetForm()
    } catch (error) {
      toast.error("Failed to save experience.")
    } finally {
      setIsSaving(false)
    }
  })

  const deleteExperience = async (experienceId: string) => {
    try {
      const experience = items.find((item) => item.id === experienceId)
      if (experience?.companyImage) await deleteImage(experience.companyImage)
      await api.deleteExperience(experienceId)
      const next = items.filter((item) => item.id !== experienceId)
      setItems(next)
      onUpdated({ ...user, experience: next })
      toast.success("Experience deleted.")
    } catch (error) {
      toast.error("Failed to delete experience.")
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" {...form.register("company")} />
              {form.formState.errors.company ? (
                <p className="text-xs text-destructive">{form.formState.errors.company.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Job title</Label>
              <Input id="title" {...form.register("title")} />
              {form.formState.errors.title ? (
                <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>Employment type</Label>
              <Select
                value={form.watch("employmentType") ?? ""}
                onValueChange={(value) =>
                  form.setValue("employmentType", value, { shouldDirty: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="min-w-[200px]">
                  {employmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...form.register("location")} placeholder="Remote" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <Label>Start month</Label>
              <Select
                value={form.watch("startMonth") ?? ""}
                onValueChange={(value) =>
                  form.setValue("startMonth", value, { shouldDirty: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent className="min-w-[160px]">
                  {months.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start year</Label>
              <Select
                value={form.watch("startYear") ?? ""}
                onValueChange={(value) =>
                  form.setValue("startYear", value, { shouldDirty: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="min-w-[120px]">
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>End month</Label>
              <Select
                value={form.watch("endMonth") ?? ""}
                onValueChange={(value) =>
                  form.setValue("endMonth", value, { shouldDirty: true })
                }
                disabled={isCurrent}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent className="min-w-[160px]">
                  {months.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>End year</Label>
              <Select
                value={form.watch("endYear") ?? ""}
                onValueChange={(value) =>
                  form.setValue("endYear", value, { shouldDirty: true })
                }
                disabled={isCurrent}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="min-w-[120px]">
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...form.register("isCurrent", {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.checked) {
                    form.setValue("endMonth", "", { shouldDirty: true })
                    form.setValue("endYear", "", { shouldDirty: true })
                  }
                },
              })}
            />
            I currently work here
          </label>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...form.register("description")} />
          </div>
          <div className="space-y-2">
            <Label>Company logo</Label>
            <ImageUpload
              value={form.watch("companyImage") ?? ""}
              onChange={(url) => form.setValue("companyImage", url, { shouldDirty: true })}
              userId={user.id}
              category="experience"
              label="company logo"
            />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
              {isSaving ? "Saving..." : editingId ? "Update experience" : "Add experience"}
            </Button>
            {editingId ? (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
        <div className="space-y-4 rounded-xl border border-border p-4">
          {sortedItems.map((item) => (
            <div key={item.id} className="flex gap-4">
              {item.companyImage ? (
                <div className="bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={item.companyImage}
                    alt={item.company}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-md">
                  <span className="text-muted-foreground text-base font-semibold">
                    {item.company.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold leading-tight">{item.title}</h3>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {item.company} · {item.employmentType ?? "Role"}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {item.startMonth} {item.startYear} – {item.isCurrent ? "Present" : `${item.endMonth ?? ""} ${item.endYear ?? ""}`.trim()}
                </p>
                {item.location && (
                  <p className="text-muted-foreground mt-0.5 text-xs">{item.location}</p>
                )}
                {item.description && (
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-start gap-1">
                <Button type="button" variant="ghost" size="icon" onClick={() => startEdit(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this experience?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteExperience(item.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No experience added yet.</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
