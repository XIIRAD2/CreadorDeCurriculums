import { extractJsonObject, str } from '@/lib/jsonExtract'
import { sanitizeLink } from '@/lib/urlShorten'
import type { ImportedJobData, ImportedJobApplication } from '@/lib/jobImportSchema'
import type { WorkMode } from '@/types/jobTracker'

export type JobParseResult = { ok: true; data: ImportedJobApplication[] } | { ok: false; error: string }

export function parseImportedJobsJson(raw: string): JobParseResult {
  const trimmed = raw.trim()
  if (!trimmed) return { ok: false, error: 'Pega el JSON que te ha devuelto la IA.' }

  const extracted = extractJsonObject(trimmed)
  if (!extracted) return { ok: false, error: 'No he encontrado un objeto JSON ({ ... }) en el texto pegado.' }

  let parsed: unknown
  try {
    parsed = JSON.parse(extracted)
  } catch {
    return { ok: false, error: 'El JSON no es válido. Revisa que hayas copiado la respuesta completa, sin cortes.' }
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: 'El JSON debe ser un objeto { "applications": [...] }.' }
  }

  const data = parsed as ImportedJobData
  if (!Array.isArray(data.applications)) {
    return { ok: false, error: 'El JSON debe tener un campo "applications" con una lista de ofertas.' }
  }

  const applications = data.applications.filter((a) => str(a?.company) || str(a?.offer) || str(a?.link))
  if (applications.length === 0) {
    return { ok: false, error: 'No se ha encontrado ninguna oferta con datos en el JSON.' }
  }

  return { ok: true, data: applications }
}

/** Pulls the first integer out of whatever the AI sent — a clean number, a range
 * ("3-5"), or free text ("más de 2 años", "más de 200 solicitudes") all resolve to the
 * first number found. Returns null when nothing numeric is there. Used for both
 * "experienceYears" and "applicantCount", which arrive in the same loose shape. */
function parseLooseInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.max(0, Math.round(value))
  if (typeof value === 'string') {
    const match = value.match(/\d+/)
    if (match) return Number(match[0])
  }
  return null
}

const VALID_WORK_MODES: WorkMode[] = ['onsite', 'remote', 'hybrid']

function parseWorkMode(value: unknown): WorkMode {
  const v = str(value).toLowerCase()
  return (VALID_WORK_MODES as string[]).includes(v) ? (v as WorkMode) : ''
}

/** Normalizes the loose AI shape into the fields `importApplications` (lib/jobTracker.ts)
 * expects — trimmed strings, a clean string[] for technologies. */
export function toApplicationInputs(entries: ImportedJobApplication[]) {
  return entries.map((e) => ({
    company: str(e.company),
    offerName: str(e.offer),
    link: sanitizeLink(str(e.link)),
    technologies: Array.isArray(e.technologies) ? e.technologies.map((t) => str(t)).filter(Boolean) : [],
    experienceYears: parseLooseInt(e.experienceYears),
    location: str(e.location),
    workMode: parseWorkMode(e.workMode),
    applicantCount: parseLooseInt(e.applicantCount),
    publishedDate: str(e.publishedDate),
  }))
}
