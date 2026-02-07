"use client"

import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"

import type { Project } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Projects</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <div key={project.id} className="rounded-xl border border-border p-4">
            <h3 className="text-base font-semibold">{project.name}</h3>
            {project.description ? (
              <p className="text-muted-foreground mt-1 text-sm">{project.description}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {project.primaryLanguage ? (
                <Badge variant="secondary">{project.primaryLanguage}</Badge>
              ) : null}
              {project.githubUrl ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={project.githubUrl} target="_blank" rel="noreferrer">
                    <Github className="h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
              ) : null}
              {project.url ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href={project.url} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Live
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
