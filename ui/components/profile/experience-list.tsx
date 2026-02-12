"use client";

import Image from "next/image";

import type { Experience } from "@/types";
import { sortExperience } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ExperienceList({ experience }: { experience: Experience[] }) {
  if (!experience?.length) return null;

  const sorted = sortExperience(experience);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        {sorted.map((item, idx) => (
          <div key={item.id}>
            {idx > 0 && <div className="mb-4" />}
            <div className="flex gap-4 px-6">
              {/* Thumbnail */}
              {item.companyImage ? (
                <div className="bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={item.companyImage}
                    alt={item.company}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-md">
                  <span className="text-muted-foreground text-base font-semibold">
                    {item.company.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Details */}
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold leading-tight">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {item.company} · {item.employmentType ?? "Role"}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {item.startMonth} {item.startYear} –{" "}
                  {item.isCurrent
                    ? "Present"
                    : `${item.endMonth ?? ""} ${item.endYear ?? ""}`.trim()}
                </p>
                {item.location && (
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {item.location}
                  </p>
                )}
                {item.description && (
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
