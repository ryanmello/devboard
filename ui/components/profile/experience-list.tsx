"use client"

import type { Experience } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ExperienceList({ experience }: { experience: Experience[] }) {
  if (!experience?.length) return null

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {experience.map((item) => (
          <div key={item.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm">
                {item.company} · {item.employmentType ?? "Role"}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.startMonth} {item.startYear} - {item.isCurrent ? "Present" : `${item.endMonth ?? ""} ${item.endYear ?? ""}`.trim()}
              </p>
              {item.location ? (
                <p className="text-xs text-muted-foreground">{item.location}</p>
              ) : null}
              {item.description ? (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              ) : null}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
