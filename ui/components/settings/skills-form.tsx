"use client"

import { useMemo, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { FullUser } from "@/types"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const schema = z.object({
  skills: z.array(z.string().min(1)).max(50),
})

type FormValues = z.infer<typeof schema>

const quickSkills = ["TypeScript", "React", "Next.js", "Go", "PostgreSQL", "Docker"]

export function SkillsForm({
  user,
  onUpdated,
}: {
  user: FullUser
  onUpdated: (user: FullUser) => void
}) {
  const [newSkill, setNewSkill] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { skills: user.skills },
  })

  const skills = form.watch("skills")
  const suggested = useMemo(
    () => quickSkills.filter((skill) => !skills.includes(skill)),
    [skills]
  )

  const addSkill = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed || skills.includes(trimmed)) return
    form.setValue("skills", [...skills, trimmed], { shouldDirty: true })
    setNewSkill("")
  }

  const removeSkill = (value: string) => {
    form.setValue(
      "skills",
      skills.filter((skill) => skill !== value),
      { shouldDirty: true }
    )
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSaving(true)
    try {
      const updated = await api.updateSkills(values.skills)
      toast.success("Skills updated.")
      onUpdated({ ...user, skills: updated.skills })
    } catch (error) {
      toast.error("Failed to update skills.")
    } finally {
      setIsSaving(false)
    }
  })

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="skill">Add a skill</Label>
          <div className="flex gap-2">
            <Input
              id="skill"
              value={newSkill}
              onChange={(event) => setNewSkill(event.target.value)}
              placeholder="e.g. TypeScript"
            />
            <Button type="button" variant="secondary" onClick={() => addSkill(newSkill)}>
              Add
            </Button>
          </div>
        </div>
        {suggested.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {suggested.map((skill) => (
              <Button
                key={skill}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSkill(skill)}
              >
                + {skill}
              </Button>
            ))}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-2">
              {skill}
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => removeSkill(skill)}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save skills"}
          </Button>
        </div>
        </form>
      </CardContent>
    </Card>
  )
}
