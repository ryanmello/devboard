import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { Experience } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const MONTH_INDEX: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
}

function toMonths(month: string | null, year: string | null): number {
  return (parseInt(year ?? "0") || 0) * 12 + (MONTH_INDEX[(month ?? "").toLowerCase()] ?? 0)
}

export function sortExperience(items: Experience[]): Experience[] {
  return [...items].sort((a, b) => {
    const aEnd = a.isCurrent ? Infinity : toMonths(a.endMonth, a.endYear)
    const bEnd = b.isCurrent ? Infinity : toMonths(b.endMonth, b.endYear)
    if (aEnd !== bEnd) return bEnd - aEnd
    return toMonths(b.startMonth, b.startYear) - toMonths(a.startMonth, a.startYear)
  })
}
