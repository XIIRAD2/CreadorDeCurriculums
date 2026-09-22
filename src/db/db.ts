import Dexie, { type Table } from 'dexie'
import type { CvDocument } from '@/types/cv'
import type { JobApplication } from '@/types/jobTracker'
import type { AppSettings } from '@/types/settings'

/** Local-only storage (IndexedDB via Dexie). Nothing here ever leaves the browser:
 * every CV version (one per company/application) is a full JSON document, which keeps
 * import/export trivial and makes "duplicate this CV and tweak it" a cheap deep clone. */
class CvDatabase extends Dexie {
  cvs!: Table<CvDocument, string>
  jobApplications!: Table<JobApplication, string>
  settings!: Table<AppSettings, string>

  constructor() {
    super('cv-builder-db')
    this.version(1).stores({
      cvs: 'id, name, updatedAt',
    })
    // v2 adds the job-application tracker table — existing `cvs` data is untouched,
    // Dexie only needs every table (changed or not) re-declared for the new version.
    this.version(2).stores({
      cvs: 'id, name, updatedAt',
      jobApplications: 'id, updatedAt',
    })
    // v3 adds a single-row settings table (the "general CV" tech tags + sought
    // positions that feed the job-tracker fit score — see types/settings.ts).
    this.version(3).stores({
      cvs: 'id, name, updatedAt',
      jobApplications: 'id, updatedAt',
      settings: 'id',
    })
  }
}

export const db = new CvDatabase()

export const LAST_ACTIVE_KEY = 'cv-builder:last-active-id'
