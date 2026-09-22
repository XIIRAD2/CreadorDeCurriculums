/** Where the job is done, when the offer says. Empty string means unspecified —
 * optional for backward compatibility with rows saved before this field existed. */
export type WorkMode = 'onsite' | 'remote' | 'hybrid' | ''

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  onsite: 'Presencial',
  remote: 'Remoto',
  hybrid: 'Híbrido',
  '': '—',
}

/** How to classify a row beyond the usual "should I apply" score — set by hand, not
 * computed. When set, it takes over the row's highlight color from the score bands (see
 * lib/jobScore.ts): a normal company posting doesn't need this, it's for the cases that
 * don't fit the "0-100 fit" framing at all. Empty string = a normal offer. */
export type ContactType = 'recruiter' | 'direct-email' | ''

export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  recruiter: 'Reclutador',
  'direct-email': 'Enviar por email',
  '': 'Normal',
}

/** A single job-offer application being tracked, independent from any one CV — the row
 * shown in the "Seguimiento de ofertas" grid. Stored as its own IndexedDB table (see
 * db/db.ts) since, unlike a CvDocument, each row is a small independent record rather
 * than one big document. */
export interface JobApplication {
  id: string
  company: string
  offerName: string
  /** Full URL to the job posting — shown shortened in the grid, but always kept intact
   * so the real page stays reachable. */
  link: string
  technologies: string[]
  /** Minimum years of experience the offer asks for, or null if unknown/not specified.
   * Optional for backward compatibility with rows saved before this field existed. */
  experienceYears?: number | null
  /** City and province/region, e.g. "Valencia, Comunidad Valenciana". Optional for
   * backward compatibility with rows saved before this field existed. */
  location?: string
  /** Optional for backward compatibility with rows saved before this field existed. */
  workMode?: WorkMode
  /** How many people have already applied, when the offer/platform shows it (LinkedIn
   * often does) — null if unknown. Feeds the "fit score" (lib/jobScore.ts): more
   * competition, lower score. Optional for backward compatibility. */
  applicantCount?: number | null
  /** Optional for backward compatibility with rows saved before this field existed. */
  contactType?: ContactType
  /** YYYY-MM-DD, or '' if unknown. */
  publishedDate: string
  /** YYYY-MM-DD, or '' if the CV hasn't been sent yet. Auto-filled to today the first
   * time `sent` is checked, but stays freely editable afterwards. */
  sentDate: string
  sent: boolean
  /** id of the CvDocument that was sent for this offer, or null if none is linked yet. */
  cvId: string | null
  createdAt: number
  updatedAt: number
}
