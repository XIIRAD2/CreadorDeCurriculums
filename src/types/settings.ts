/** App-wide settings that feed the job-tracker "fit score" (lib/jobScore.ts) —
 * deliberately global, not tied to any one CV: the tracker lists offers regardless of
 * which CV you have open, so its scoring reference has to live outside any single CV
 * too. Stored as a single row in Dexie (db/db.ts, table `settings`, id "default"). */

export type ExperienceLevel = 'junior' | 'intermediate' | 'senior'

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  junior: 'Junior',
  intermediate: 'Intermedio',
  senior: 'Senior',
}

export interface SoughtPosition {
  id: string
  title: string
  level: ExperienceLevel
}

export interface AppSettings {
  id: 'default'
  /** The "general CV" tech tags — your overall known stack, used to score how well an
   * offer's required technologies match you, independent of any one tailored CV. */
  baseTechnologies: string[]
  /** Job titles/levels you're actively looking for — feeds both the experience-match
   * part of the score and the context injected into the job-tracker AI import prompt. */
  soughtPositions: SoughtPosition[]
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  id: 'default',
  baseTechnologies: [],
  soughtPositions: [],
}
