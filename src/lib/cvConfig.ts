import { SECTION_LABELS } from '@/types/cv'
import { genId } from '@/lib/id'
import { DEFAULT_COLUMNS } from '@/lib/columns'
import type { CvDocument, CvTheme, SectionId, ColumnLayout, Density, PhotoShape, TemplateId, DescriptionStyle } from '@/types/cv'

/** Just the *design* of a CV — theme + section order/visibility/columns — deliberately
 * separate from its content (lib/cvExport.ts). The point: set up your favorite look once,
 * export it, and apply it to every new CV in one click instead of reconfiguring colors/
 * fonts/density/columns by hand each time. */
export interface CvConfigJson {
  theme: CvTheme
  sectionOrder: SectionId[]
  hiddenSections: SectionId[]
  columns: ColumnLayout[]
}

const ALL_SECTIONS = Object.keys(SECTION_LABELS) as SectionId[]
const DENSITIES: Density[] = ['compact', 'comfortable', 'spacious']
const PHOTO_SHAPES: PhotoShape[] = ['circle', 'rounded', 'square', 'corner']
const TEMPLATES: TemplateId[] = ['sidebar', 'minimal', 'two-column', 'elegant', 'compact-ats', 'custom']
const DESCRIPTION_STYLES: DescriptionStyle[] = ['paragraph', 'bullets']

export function exportCvConfig(cv: CvDocument): CvConfigJson {
  return {
    theme: cv.theme,
    sectionOrder: cv.sectionOrder,
    hiddenSections: cv.hiddenSections,
    columns: cv.columns && cv.columns.length > 0 ? cv.columns : DEFAULT_COLUMNS,
  }
}

function str(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : fallback
}

function num(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function clampedNum(value: unknown, fallback: number, min: number, max: number): number {
  const n = num(value, fallback)
  return Math.min(max, Math.max(min, n))
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function sectionArray(value: unknown, fallback: SectionId[]): SectionId[] {
  if (!Array.isArray(value)) return fallback
  const valid = value.filter((v): v is SectionId => typeof v === 'string' && ALL_SECTIONS.includes(v as SectionId))
  return valid.length > 0 ? valid : fallback
}

/** Same defensive, field-by-field rebuild as the rest of this file, plus the same
 * "any known section missing from every column gets appended to the last one" self-
 * healing `sectionOrder` already gets below — so a hand-edited or partial `columns`
 * array can never leave a section unreachable in the Diseño-tab editor. */
function columnsArray(value: unknown, fallback: ColumnLayout[]): ColumnLayout[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 4) return fallback

  const parsed: ColumnLayout[] = []
  for (const item of value) {
    if (typeof item !== 'object' || item === null) continue
    const obj = item as Record<string, unknown>
    const sectionIds = Array.isArray(obj.sectionIds)
      ? obj.sectionIds.filter((s): s is SectionId => typeof s === 'string' && ALL_SECTIONS.includes(s as SectionId))
      : []
    parsed.push({
      id: str(obj.id, genId()),
      widthPercent: clampedNum(obj.widthPercent, 100 / value.length, 5, 95),
      sectionIds,
    })
  }
  if (parsed.length === 0) return fallback

  const assigned = new Set(parsed.flatMap((c) => c.sectionIds))
  const missing = ALL_SECTIONS.filter((s) => !assigned.has(s))
  if (missing.length > 0) parsed[parsed.length - 1].sectionIds.push(...missing)

  return parsed
}

export type ConfigParseResult = { ok: true; data: CvConfigJson } | { ok: false; error: string }

/** Parses a pasted/uploaded config file defensively against `base` (the CV it's about
 * to be applied to) — every field falls back to what `base` already has if missing or
 * the wrong shape/type. That matters here specifically: an unknown `density`, for
 * instance, would otherwise crash the spacing lookup in lib/themeRuntime.ts the moment
 * the preview tries to render. A hand-edited or partial file can never corrupt the CV. */
export function parseCvConfigJson(raw: string, base: CvDocument): ConfigParseResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, error: 'El archivo no es un JSON válido.' }
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: 'El JSON debe ser un objeto { "theme": {...}, ... }.' }
  }

  const obj = parsed as Record<string, unknown>
  const t = (typeof obj.theme === 'object' && obj.theme !== null ? obj.theme : {}) as Record<string, unknown>
  const bt = base.theme

  const theme: CvTheme = {
    templateId: oneOf(t.templateId, TEMPLATES, bt.templateId),
    paletteId: str(t.paletteId, bt.paletteId),
    primaryColor: str(t.primaryColor, bt.primaryColor),
    accentColor: str(t.accentColor, bt.accentColor),
    textColor: str(t.textColor, bt.textColor),
    fontPairingId: str(t.fontPairingId, bt.fontPairingId),
    headingFont: str(t.headingFont, bt.headingFont),
    bodyFont: str(t.bodyFont, bt.bodyFont),
    fontScale: num(t.fontScale, bt.fontScale),
    density: oneOf(t.density, DENSITIES, bt.density),
    photoShape: oneOf(t.photoShape, PHOTO_SHAPES, bt.photoShape),
    showPhoto: bool(t.showPhoto, bt.showPhoto),
    photoZoom: clampedNum(t.photoZoom, bt.photoZoom ?? 1, 0.6, 2),
    showSkillBar: bool(t.showSkillBar, bt.showSkillBar !== false),
    showSkillLevel: bool(t.showSkillLevel, bt.showSkillLevel !== false),
    descriptionStyle: oneOf(t.descriptionStyle, DESCRIPTION_STYLES, bt.descriptionStyle ?? 'paragraph'),
  }

  const sectionOrder = sectionArray(obj.sectionOrder, base.sectionOrder)
  // Any known section missing from an incomplete imported order is appended, so every
  // section stays reachable/toggleable instead of silently disappearing from the tabs.
  const completeOrder = [...sectionOrder, ...ALL_SECTIONS.filter((s) => !sectionOrder.includes(s))]
  const hiddenSections = sectionArray(obj.hiddenSections, base.hiddenSections).filter((s) => completeOrder.includes(s))
  const columns = columnsArray(obj.columns, base.columns && base.columns.length > 0 ? base.columns : DEFAULT_COLUMNS)

  return { ok: true, data: { theme, sectionOrder: completeOrder, hiddenSections, columns } }
}
