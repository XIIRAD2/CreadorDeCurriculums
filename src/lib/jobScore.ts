import type { JobApplication } from '@/types/jobTracker'
import type { AppSettings, ExperienceLevel } from '@/types/settings'

/** A representative years-of-experience figure per level — used only to compare against
 * an offer's `experienceYears`, not shown anywhere. Deliberately generous (the top of a
 * realistic range for that level) so being open to a level doesn't unfairly tank offers
 * that ask for a bit more than the level's minimum. */
const LEVEL_YEARS: Record<ExperienceLevel, number> = {
  junior: 2,
  intermediate: 5,
  senior: 10,
}

export interface JobScoreBreakdown {
  /** 0-100, or null when there isn't enough data to score at all (no sought positions
   * AND no base technologies configured — see "Mi perfil de búsqueda"). */
  overall: number | null
  tech: number | null
  experience: number | null
  competition: number | null
}

function techMatchScore(offerTechs: string[], baseTechs: string[]): number | null {
  if (offerTechs.length === 0) return null // nothing to compare against
  if (baseTechs.length === 0) return null // no reference stack configured yet
  const base = new Set(baseTechs.map((t) => t.toLowerCase().trim()))
  const matches = offerTechs.filter((t) => base.has(t.toLowerCase().trim())).length
  return Math.round((matches / offerTechs.length) * 100)
}

function experienceMatchScore(offerYears: number | null | undefined, soughtPositions: AppSettings['soughtPositions']): number | null {
  if (offerYears === null || offerYears === undefined) return null
  if (soughtPositions.length === 0) return null
  const userYears = Math.max(...soughtPositions.map((p) => LEVEL_YEARS[p.level]))
  if (offerYears <= userYears) return 100
  const diff = offerYears - userYears
  return Math.max(0, Math.round(100 - diff * 25))
}

function competitionScore(applicantCount: number | null | undefined): number | null {
  if (applicantCount === null || applicantCount === undefined) return null
  if (applicantCount <= 10) return 100
  if (applicantCount <= 50) return 80
  if (applicantCount <= 100) return 60
  if (applicantCount <= 200) return 40
  return 20
}

/** The offer's "fit score" (0-100): how much it's worth applying to, given your
 * configured stack and target experience level. Weighted average of three factors —
 * tech match counts most (it's the one thing squarely about whether you're qualified),
 * experience next, competition least (you can't control it, and it's the least reliable
 * data point). Any factor with no data (e.g. the offer doesn't list technologies, or you
 * haven't set up "Mi perfil de búsqueda" yet) is simply left out of the average rather
 * than guessed at or penalized. Returns `overall: null` when nothing at all can be
 * computed, so the UI can show "—" instead of a misleading number. */
export function computeJobScore(app: JobApplication, settings: AppSettings): JobScoreBreakdown {
  const tech = techMatchScore(app.technologies, settings.baseTechnologies)
  const experience = experienceMatchScore(app.experienceYears, settings.soughtPositions)
  const competition = competitionScore(app.applicantCount)

  const weighted: Array<[number | null, number]> = [
    [tech, 0.45],
    [experience, 0.3],
    [competition, 0.25],
  ]
  const available = weighted.filter((w): w is [number, number] => w[0] !== null)
  if (available.length === 0) return { overall: null, tech, experience, competition }

  const totalWeight = available.reduce((sum, [, w]) => sum + w, 0)
  const overall = Math.round(available.reduce((sum, [score, w]) => sum + score * w, 0) / totalWeight)

  return { overall, tech, experience, competition }
}

export type ScoreBand = 'green' | 'yellow' | 'red' | 'unscored'

/** green 80-100 · yellow 60-79 · red 0-59 — the bands the request asked for, extended
 * down to cover the 50-60 gap it left unspecified rather than leaving it undefined. */
export function scoreBand(score: number | null): ScoreBand {
  if (score === null) return 'unscored'
  if (score >= 80) return 'green'
  if (score >= 60) return 'yellow'
  return 'red'
}
