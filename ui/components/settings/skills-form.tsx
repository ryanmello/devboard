"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { GripVertical } from "lucide-react"

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

const quickSkills = [
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "Vue",
  "Angular",
  "Svelte",
  "Node.js",
  "Express",
  "Go",
  "Python",
  "Java",
  "C#",
  "C++",
  "Rust",
  "Ruby",
  "Swift",
  "Kotlin",
  "PHP",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "SQLite",
  "Prisma",
  "Docker",
  "Kubernetes",
  "AWS",
  "GCP",
  "Azure",
  "Terraform",
  "CI/CD",
  "Git",
  "GraphQL",
  "REST APIs",
  "Linux",
  "Firebase",
  "Supabase",
  "Django",
  "Flask",
  "Spring Boot",
  "Rails",
  ".NET",
  "Electron",
  "React Native",
  "Flutter",
  "TensorFlow",
  "PyTorch",
  "LangChain",
]

export function SkillsForm({
  user,
  onUpdated,
}: {
  user: FullUser
  onUpdated: (user: FullUser) => void
}) {
  const [newSkill, setNewSkill] = useState("")
  const [skillSearch, setSkillSearch] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { skills: user.skills },
  })

  const skills = form.watch("skills")
  const suggested = useMemo(
    () =>
      quickSkills.filter(
        (skill) =>
          !skills.includes(skill) &&
          skill.toLowerCase().includes(skillSearch.toLowerCase())
      ),
    [skills, skillSearch]
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

  const dragIndex = useRef<number | null>(null)

  const moveSkill = useCallback(
    (from: number, to: number) => {
      if (from === to) return
      const updated = [...skills]
      const [moved] = updated.splice(from, 1)
      updated.splice(to, 0, moved)
      form.setValue("skills", updated, { shouldDirty: true })
    },
    [skills, form]
  )

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
        <div className="space-y-2 mb-8">
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
        <div className="space-y-2 mb-8">
          <Input
            value={skillSearch}
            onChange={(event) => setSkillSearch(event.target.value)}
            placeholder="Search quick skills..."
          />
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
          ) : (
            <p className="text-sm text-muted-foreground">
              {skillSearch ? "No matching skills found." : "All quick skills added!"}
            </p>
          )}
        </div>
        {skills.length > 0 && (
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">
              Drag to reorder
            </Label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="gap-1 select-none cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={() => {
                    dragIndex.current = index
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    if (dragIndex.current !== null && dragIndex.current !== index) {
                      moveSkill(dragIndex.current, index)
                      dragIndex.current = index
                    }
                  }}
                  onDragEnd={() => {
                    dragIndex.current = null
                  }}
                >
                  <GripVertical className="h-3 w-3 shrink-0 text-muted-foreground" />
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
          </div>
        )}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving || !form.formState.isDirty}>
            {isSaving ? "Saving..." : "Save skills"}
          </Button>
        </div>
        </form>
      </CardContent>
    </Card>
  )
}
