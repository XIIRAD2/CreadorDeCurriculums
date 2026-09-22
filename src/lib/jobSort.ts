import { WORK_MODE_LABELS } from '@/types/jobTracker'
import { computeJobScore } from '@/lib/jobScore'
import type { JobApplication } from '@/types/jobTracker'
import type { AppSettings } from '@/types/settings'

export type JobSortKey =
  | 'company'
  | 'offerName'
  | 'link'
  | 'location'
  | 'workMode'
  | 'technologies'
  | 'experienceYears'
  | 'applicantCount'
  | 'score'
  | 'publishedDate'
  | 'sentDate'
  | 'sent'
  | 'cvName'

export interface JobSortState {
  key: JobSortKey
  direction: 'asc' | 'desc'
}

type SortValue = string | number | null

/** Pulls the value to compare for one column — nulls/empty mean "no data", always
 * sorted to the end regardless of direction (see compareSortValues). */
function sortValue(app: JobApplication, key: JobSortKey, cvNameById: Map<string, string>, settings: AppSettings): SortValue {
  switch (key) {
    case 'company':
      return app.company || null
    case 'offerName':
      return app.offerName || null
    case 'link':
      return app.link || null
    case 'location':
      return app.location || null
    case 'workMode':
      return app.workMode ? WORK_MODE_LABELS[app.workMode] : null
    case 'technologies':
      return app.technologies.length > 0 ? app.technologies.join(', ') : null
    case 'experienceYears':
      return app.experienceYears ?? null
    case 'applicantCount':
      return app.applicantCount ?? null
    case 'score':
      return computeJobScore(app, settings).overall
    case 'publishedDate':
      return app.publishedDate || null
    case 'sentDate':
      return app.sentDate || null
    case 'sent':
      return app.sent ? 1 : 0
    case 'cvName':
      return app.cvId ? (cvNameById.get(app.cvId) ?? null) : null
  }
}

/** Nulls always sort last — regardless of direction, so flipping to "descending" never
 * jumps rows with missing data up to the top. Direction only flips the comparison
 * between two actual values. */
function compareSortValues(a: SortValue, b: SortValue, direction: 'asc' | 'desc'): number {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1
  const cmp =
    typeof a === 'number' && typeof b === 'number'
      ? a - b
      : String(a).localeCompare(String(b), 'es', { sensitivity: 'base', numeric: true })
  return direction === 'asc' ? cmp : -cmp
}

/** Sorts a copy of `apps` per `sort` (rows with no value for that column always drop to
 * the bottom); returns `apps` unchanged (same reference) when `sort` is null, which is
 * the "back to most-recently-updated first" state from the Dexie query. */
export function sortApplications(
  apps: JobApplication[],
  sort: JobSortState | null,
  cvNameById: Map<string, string>,
  settings: AppSettings,
): JobApplication[] {
  if (!sort) return apps
  return [...apps].sort((a, b) =>
    compareSortValues(
      sortValue(a, sort.key, cvNameById, settings),
      sortValue(b, sort.key, cvNameById, settings),
      sort.direction,
    ),
  )
}
