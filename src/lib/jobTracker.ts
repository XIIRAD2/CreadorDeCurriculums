import { db } from '@/db/db'
import { genId } from '@/lib/id'
import type { JobApplication } from '@/types/jobTracker'

/** Local YYYY-MM-DD (not UTC), so "today" matches the user's own calendar day
 * regardless of timezone offset. */
export function todayDateString(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function emptyApplication(): JobApplication {
  const now = Date.now()
  return {
    id: genId(),
    company: '',
    offerName: '',
    link: '',
    technologies: [],
    experienceYears: null,
    location: '',
    workMode: '',
    applicantCount: null,
    contactType: '',
    publishedDate: '',
    sentDate: '',
    sent: false,
    cvId: null,
    createdAt: now,
    updatedAt: now,
  }
}

export async function addApplication(): Promise<string> {
  const app = emptyApplication()
  await db.jobApplications.add(app)
  return app.id
}

export async function updateApplication(id: string, patch: Partial<JobApplication>): Promise<void> {
  await db.jobApplications.update(id, { ...patch, updatedAt: Date.now() })
}

/** Checking auto-fills today's date the first time only — it never overwrites a date
 * already there (e.g. one the user corrected by hand to when the CV actually went
 * out). Unchecking just turns off the green highlight; it deliberately leaves the
 * date alone as a record of when it was sent, in case the check was toggled by mistake. */
export async function setApplicationSent(id: string, sent: boolean): Promise<void> {
  const current = await db.jobApplications.get(id)
  const patch: Partial<JobApplication> = { sent, updatedAt: Date.now() }
  if (sent && !current?.sentDate) patch.sentDate = todayDateString()
  await db.jobApplications.update(id, patch)
}

export async function removeApplication(id: string): Promise<void> {
  await db.jobApplications.delete(id)
}

export async function removeApplications(ids: string[]): Promise<void> {
  await db.jobApplications.bulkDelete(ids)
}

/** Bulk-adds rows parsed from an AI import — always as brand-new entries (unlike CV
 * import there's nothing sensible to "merge into", each offer is its own record). */
export async function importApplications(
  entries: Array<
    Pick<
      JobApplication,
      | 'company'
      | 'offerName'
      | 'link'
      | 'technologies'
      | 'publishedDate'
      | 'experienceYears'
      | 'location'
      | 'workMode'
      | 'applicantCount'
    >
  >,
): Promise<number> {
  const now = Date.now()
  const rows: JobApplication[] = entries.map((e) => ({
    id: genId(),
    company: e.company,
    offerName: e.offerName,
    link: e.link,
    technologies: e.technologies,
    experienceYears: e.experienceYears,
    location: e.location,
    workMode: e.workMode,
    applicantCount: e.applicantCount,
    contactType: '',
    publishedDate: e.publishedDate,
    sentDate: '',
    sent: false,
    cvId: null,
    createdAt: now,
    updatedAt: now,
  }))
  await db.jobApplications.bulkAdd(rows)
  return rows.length
}
