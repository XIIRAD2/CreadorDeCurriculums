import { SIDEBAR_SECTIONS, MAIN_SECTIONS } from '@/lib/sections'
import type { CvDocument, ColumnLayout, SectionId } from '@/types/cv'

/** Equivalent split to the old hardcoded SIDEBAR_SECTIONS/MAIN_SECTIONS constants, at the
 * same 35/65 width — used whenever a document has no `columns` of its own yet (every CV
 * saved before this feature existed), so nothing changes visually for existing CVs. */
export const DEFAULT_COLUMNS: ColumnLayout[] = [
  { id: 'default-sidebar', widthPercent: 35, sectionIds: [...SIDEBAR_SECTIONS] },
  { id: 'default-main', widthPercent: 65, sectionIds: [...MAIN_SECTIONS] },
]

/** The one place that decides which section goes in which column — every column-based
 * template (Barra lateral, Dos columnas, Personalizada) and the column-grouped
 * "Secciones" editor in Diseño read from here; nobody else re-implements the split.
 *
 * - Falls back to `DEFAULT_COLUMNS` when the document has no `columns` of its own.
 * - Drops hidden sections unless `includeHidden` is set (the Diseño-tab editor wants to
 *   keep showing/dragging hidden sections; the actual templates never render them).
 * - Any visible section not assigned to any column (added to the CV after `columns` was
 *   last saved, or left out by a partial import) is appended to the last column — same
 *   self-healing principle `parseCvConfigJson` already applies to `sectionOrder`. */
export function getEffectiveColumns(cv: CvDocument, opts?: { includeHidden?: boolean }): ColumnLayout[] {
  const stored = cv.columns && cv.columns.length > 0 ? cv.columns : DEFAULT_COLUMNS
  const includeHidden = opts?.includeHidden ?? false
  const isVisible = (id: SectionId) => includeHidden || !cv.hiddenSections.includes(id)

  const assigned = new Set<SectionId>()
  const result = stored.map((col) => {
    const sectionIds = col.sectionIds.filter((id) => cv.sectionOrder.includes(id) && isVisible(id) && !assigned.has(id))
    sectionIds.forEach((id) => assigned.add(id))
    return { ...col, sectionIds }
  })

  const unassigned = cv.sectionOrder.filter((id) => isVisible(id) && !assigned.has(id))
  if (unassigned.length > 0 && result.length > 0) {
    const last = result.length - 1
    result[last] = { ...result[last], sectionIds: [...result[last].sectionIds, ...unassigned] }
  }
  return result
}

/** For "Barra lateral"/"Dos columnas", which only ever have 2 visual slots: the first
 * column fills the first slot, and every other column (e.g. the document was set up
 * under "Personalizada" with 3-4 columns) gets merged into the second — so switching
 * template never silently drops a section. */
export function getTwoSlotColumns(cv: CvDocument): [ColumnLayout, ColumnLayout] {
  const columns = getEffectiveColumns(cv)
  const first = columns[0] ?? { id: 'slot-1', widthPercent: 35, sectionIds: [] }
  const rest = columns.slice(1)
  const second: ColumnLayout = {
    id: rest[0]?.id ?? 'slot-2',
    widthPercent: Math.max(0, 100 - first.widthPercent),
    sectionIds: rest.flatMap((c) => c.sectionIds),
  }
  return [first, second]
}
