"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Pencil, Trash2 } from "lucide-react"

import type { FullUser, Project } from "@/types"
import { api } from "@/lib/api"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const schema = z.object({
  name: z.string().min(1, "Project name is required."),
  description: z.string().optional(),
  githubUrl: z.string().url("Enter a valid URL.").optional().or(z.literal("")),
  url: z.string().url("Enter a valid URL.").optional().or(z.literal("")),
  primaryLanguage: z.string().optional(),
  image: z.string().url("Enter a valid URL.").optional().or(z.literal("")),
})

type FormValues = z.infer<typeof schema>

export function ProjectsForm({
  user,
  onUpdated,
}: {
  user: FullUser
  onUpdated: (user: FullUser) => void
}) {
  const [items, setItems] = useState<Project[]>(user.projects ?? [])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      githubUrl: "",
      url: "",
      primaryLanguage: "",
      image: "",
    },
  })

  useEffect(() => {
    setItems(user.projects ?? [])
  }, [user.projects])

  const startEdit = (project: Project) => {
    setEditingId(project.id)
    form.reset({
      name: project.name,
      description: project.description ?? "",
      githubUrl: project.githubUrl ?? "",
      url: project.url ?? "",
      primaryLanguage: project.primaryLanguage ?? "",
      image: project.image ?? "",
    })
  }

  const resetForm = () => {
    setEditingId(null)
    form.reset({
      name: "",
      description: "",
      githubUrl: "",
      url: "",
      primaryLanguage: "",
      image: "",
    })
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSaving(true)
    try {
      if (editingId) {
        const updated = await api.updateProject(editingId, values)
        const next = items.map((item) => (item.id === updated.id ? updated : item))
        setItems(next)
        onUpdated({ ...user, projects: next })
        toast.success("Project updated.")
      } else {
        const created = await api.createProject(values)
        const next = [created, ...items]
        setItems(next)
        onUpdated({ ...user, projects: next })
        toast.success("Project added.")
      }
      resetForm()
    } catch (error) {
      toast.error("Failed to save project.")
    } finally {
      setIsSaving(false)
    }
  })

  const deleteProject = async (projectId: string) => {
    try {
      await api.deleteProject(projectId)
      const next = items.filter((item) => item.id !== projectId)
      setItems(next)
      onUpdated({ ...user, projects: next })
      toast.success("Project deleted.")
    } catch (error) {
      toast.error("Failed to delete project.")
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Project name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            ) : null}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...form.register("description")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input id="githubUrl" {...form.register("githubUrl")} />
            {form.formState.errors.githubUrl ? (
              <p className="text-xs text-destructive">{form.formState.errors.githubUrl.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">Live URL</Label>
            <Input id="url" {...form.register("url")} />
            {form.formState.errors.url ? (
              <p className="text-xs text-destructive">{form.formState.errors.url.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="primaryLanguage">Primary language</Label>
            <Input id="primaryLanguage" {...form.register("primaryLanguage")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" {...form.register("image")} />
            {form.formState.errors.image ? (
              <p className="text-xs text-destructive">{form.formState.errors.image.message}</p>
            ) : null}
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : editingId ? "Update project" : "Add project"}
            </Button>
            {editingId ? (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel edit
              </Button>
            ) : null}
          </div>
        </form>
        <div className="space-y-3">
          {items.map((project) => (
            <div key={project.id} className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{project.name}</h3>
                  {project.description ? (
                    <p className="text-muted-foreground text-sm">{project.description}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="icon" onClick={() => startEdit(project)}>
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
                        <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteProject(project.id)}>
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
            <p className="text-sm text-muted-foreground">No projects yet.</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
