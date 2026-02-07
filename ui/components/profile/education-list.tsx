"use client"

import type { Education } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EducationList({ education }: { education: Education[] }) {
  if (!education?.length) return null

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {education.map((item) => (
          <div key={item.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold">{item.universityName}</h3>
              <p className="text-muted-foreground text-sm">
                {item.major}{item.minor ? ` · Minor in ${item.minor}` : ""}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.startYear} - {item.graduationYear}
              </p>
              {item.gpa ? (
                <p className="text-xs text-muted-foreground">GPA: {item.gpa}</p>
              ) : null}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
