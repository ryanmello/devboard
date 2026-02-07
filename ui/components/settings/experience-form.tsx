"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Pencil, Trash2 } from "lucide-react"

import type { Experience, FullUser } from "@/types"
import { api } from "@/lib/api"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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
  const [items, setItems] = useState<Experience[]>(user.experience)
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

  useEffect(() => {
    setItems(user.experience)
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
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
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
            <Label htmlFor="companyImage">Company image URL</Label>
            <Input id="companyImage" {...form.register("companyImage")} />
            {form.formState.errors.companyImage ? (
              <p className="text-xs text-destructive">{form.formState.errors.companyImage.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="startMonth">Start month</Label>
            <Input id="startMonth" {...form.register("startMonth")} placeholder="Jan" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startYear">Start year</Label>
            <Input id="startYear" {...form.register("startYear")} placeholder="2022" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endMonth">End month</Label>
            <Input id="endMonth" {...form.register("endMonth")} placeholder="Dec" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endYear">End year</Label>
            <Input id="endYear" {...form.register("endYear")} placeholder="2024" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employmentType">Employment type</Label>
            <Input id="employmentType" {...form.register("employmentType")} placeholder="Full-time" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...form.register("location")} placeholder="Remote" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...form.register("description")} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("isCurrent")} />
              I currently work here
            </label>
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : editingId ? "Update experience" : "Add experience"}
            </Button>
            {editingId ? (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel edit
              </Button>
            ) : null}
          </div>
        </form>
        <div className="space-y-3">
          {items.map((experience) => (
            <div key={experience.id} className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{experience.title}</h3>
                  <p className="text-muted-foreground text-sm">{experience.company}</p>
                  <p className="text-xs text-muted-foreground">
                    {experience.startMonth} {experience.startYear} - {experience.isCurrent ? "Present" : `${experience.endMonth ?? ""} ${experience.endYear ?? ""}`.trim()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="icon" onClick={() => startEdit(experience)}>
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
                        <AlertDialogAction onClick={() => deleteExperience(experience.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
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
