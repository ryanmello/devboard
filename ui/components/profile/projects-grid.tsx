"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Github } from "lucide-react"

import type { Project } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  if (!projects?.length) return null

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        {projects.map((project, idx) => (
          <div key={project.id}>
            {idx > 0 && <div className="mb-6" />}
            <div className="flex gap-4 px-6">
              {/* Thumbnail */}
              {project.image ? (
                <div className="bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover"
                  />
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
                <h3 className="text-base font-semibold leading-tight">
                  {project.name}
                </h3>

                {project.primaryLanguage && (
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {project.primaryLanguage}
                  </p>
                )}

                {project.description && (
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {project.description}
                  </p>
                )}

                {(project.githubUrl || project.url) && (
                  <div className="mt-3 flex items-center gap-2">
                    {project.githubUrl && (
                      <Link
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="border-border text-muted-foreground hover:text-foreground hover:border-foreground/25 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                      >
                        <Github className="h-3.5 w-3.5" />
                        GitHub
                      </Link>
                    )}
                    {project.url && (
                      <Link
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className="border-border text-muted-foreground hover:text-foreground hover:border-foreground/25 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        Live
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
