"use client"

import Image from "next/image"

import type { Education } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EducationList({ education }: { education: Education[] }) {
  if (!education?.length) return null

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        {education.map((item, idx) => (
          <div key={item.id}>
            {idx > 0 && <div className="border-border mx-6 border-t" />}
            <div className="flex gap-4 px-6">
              {/* Thumbnail */}
              {item.universityImage ? (
                <div className="bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={item.universityImage}
                    alt={item.universityName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-md">
                  <span className="text-muted-foreground text-base font-semibold">
                    {item.universityName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Details */}
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold leading-tight">
                  {item.universityName}
                </h3>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {item.major}{item.minor ? ` · Minor in ${item.minor}` : ""}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {item.startYear} – {item.graduationYear}
                </p>
                {item.gpa && (
                  <p className="text-muted-foreground mt-0.5 text-xs">GPA: {item.gpa}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
