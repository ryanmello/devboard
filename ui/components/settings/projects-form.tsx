"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Github, Pencil, Trash2 } from "lucide-react"

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
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects yet.</p>
          ) : null}
          {items.map((project, idx) => (
            <div key={project.id} className="rounded-xl border border-border">
              {idx > 0 ? <div className="border-border mx-6 border-t" /> : null}
              <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-start">
                {/* Thumbnail */}
                {project.image ? (
                  <div className="bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                    <Image src={project.image} alt={project.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-md">
                    <span className="text-muted-foreground text-base font-semibold">
                      {project.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold leading-tight">{project.name}</h3>
                  {project.primaryLanguage ? (
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {project.primaryLanguage}
                    </p>
                  ) : null}
                  {project.description ? (
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  ) : null}

                  {(project.githubUrl || project.url) ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {project.githubUrl ? (
                        <Link
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="border-border text-muted-foreground hover:text-foreground hover:border-foreground/25 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                        >
                          <Github className="h-3.5 w-3.5" />
                          GitHub
                        </Link>
                      ) : null}
                      {project.url ? (
                        <Link
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                          className="border-border text-muted-foreground hover:text-foreground hover:border-foreground/25 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          Live
                        </Link>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 sm:ml-auto sm:self-start">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => startEdit(project)}
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
        </div>
      </CardContent>
    </Card>
  )
}
