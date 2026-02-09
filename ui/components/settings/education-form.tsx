"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"

import type { Education, FullUser } from "@/types"
import { api } from "@/lib/api"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const schema = z.object({
  universityName: z.string().min(1, "University name is required."),
  universityImage: z.string().url("Enter a valid URL.").optional().or(z.literal("")),
  major: z.string().min(1, "Major is required."),
  minor: z.string().optional(),
  startYear: z.string().min(4, "Start year is required."),
  graduationYear: z.string().min(4, "Graduation year is required."),
  gpa: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function EducationForm({
  user,
  onUpdated,
}: {
  user: FullUser
  onUpdated: (user: FullUser) => void
}) {
  const [items, setItems] = useState<Education[]>(user.education ?? [])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      universityName: "",
      universityImage: "",
      major: "",
      minor: "",
      startYear: "",
      graduationYear: "",
      gpa: "",
    },
  })

  useEffect(() => {
    setItems(user.education ?? [])
  }, [user.education])

  const startEdit = (education: Education) => {
    setEditingId(education.id)
    form.reset({
      universityName: education.universityName,
      universityImage: education.universityImage ?? "",
      major: education.major,
      minor: education.minor ?? "",
      startYear: education.startYear,
      graduationYear: education.graduationYear,
      gpa: education.gpa ?? "",
    })
  }

  const resetForm = () => {
    setEditingId(null)
    form.reset({
      universityName: "",
      universityImage: "",
      major: "",
      minor: "",
      startYear: "",
      graduationYear: "",
      gpa: "",
    })
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSaving(true)
    try {
      if (editingId) {
        const updated = await api.updateEducation(editingId, values)
        const next = items.map((item) => (item.id === updated.id ? updated : item))
        setItems(next)
        onUpdated({ ...user, education: next })
        toast.success("Education updated.")
      } else {
        const created = await api.createEducation(values)
        const next = [created, ...items]
        setItems(next)
        onUpdated({ ...user, education: next })
        toast.success("Education added.")
      }
      resetForm()
    } catch (error) {
      toast.error("Failed to save education.")
    } finally {
      setIsSaving(false)
    }
  })

  const deleteEducation = async (educationId: string) => {
    try {
      await api.deleteEducation(educationId)
      const next = items.filter((item) => item.id !== educationId)
      setItems(next)
      onUpdated({ ...user, education: next })
      toast.success("Education deleted.")
    } catch (error) {
      toast.error("Failed to delete education.")
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="universityName">University name</Label>
            <Input id="universityName" {...form.register("universityName")} />
            {form.formState.errors.universityName ? (
              <p className="text-xs text-destructive">{form.formState.errors.universityName.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="major">Major</Label>
            <Input id="major" {...form.register("major")} />
            {form.formState.errors.major ? (
              <p className="text-xs text-destructive">{form.formState.errors.major.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="minor">Minor</Label>
            <Input id="minor" {...form.register("minor")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startYear">Start year</Label>
            <Input id="startYear" {...form.register("startYear")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="graduationYear">Graduation year</Label>
            <Input id="graduationYear" {...form.register("graduationYear")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gpa">GPA</Label>
            <Input id="gpa" {...form.register("gpa")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="universityImage">University image URL</Label>
            <Input id="universityImage" {...form.register("universityImage")} />
            {form.formState.errors.universityImage ? (
              <p className="text-xs text-destructive">{form.formState.errors.universityImage.message}</p>
            ) : null}
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center justify-end gap-3">
            <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
              {isSaving ? "Saving..." : editingId ? "Update education" : "Add education"}
            </Button>
            {editingId ? (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No education added yet.</p>
          ) : null}
          {items.map((education, idx) => (
            <div key={education.id} className="rounded-xl border border-border">
              {idx > 0 ? <div className="border-border mx-6 border-t" /> : null}
              <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-start">
                {/* Thumbnail */}
                {education.universityImage ? (
                  <div className="bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={education.universityImage}
                      alt={education.universityName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-md">
                    <span className="text-muted-foreground text-base font-semibold">
                      {education.universityName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold leading-tight">
                    {education.universityName}
                  </h3>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    {education.major}
                    {education.minor ? ` · Minor in ${education.minor}` : ""}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {education.startYear} – {education.graduationYear}
                  </p>
                  {education.gpa ? (
                    <p className="text-muted-foreground mt-0.5 text-xs">GPA: {education.gpa}</p>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 sm:ml-auto sm:self-start">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => startEdit(education)}
                  >
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
                        <AlertDialogTitle>Delete this education?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteEducation(education.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
