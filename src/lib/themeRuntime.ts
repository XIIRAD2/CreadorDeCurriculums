import type { Density } from '@/types/cv'

export interface Spacing {
  sectionGap: number
  itemGap: number
  pagePadding: number
  lineHeight: number
}

const DENSITY_SPACING: Record<Density, Spacing> = {
  compact: { sectionGap: 13, itemGap: 7, pagePadding: 30, lineHeight: 1.35 },
  comfortable: { sectionGap: 19, itemGap: 11, pagePadding: 38, lineHeight: 1.5 },
  spacious: { sectionGap: 26, itemGap: 15, pagePadding: 46, lineHeight: 1.65 },
}

export function getSpacing(density: Density): Spacing {
  return DENSITY_SPACING[density]
}
