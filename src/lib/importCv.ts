import { genId } from '@/lib/id'
import { LANGUAGE_LEVELS } from '@/lib/levels'
import { extractJsonObject, str } from '@/lib/jsonExtract'
import type {
  CvDocument,
  Skill,
  Language,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  CertificationEntry,
  LinkEntry,
} from '@/types/cv'
import type { ImportedCvData } from '@/lib/importSchema'

// ---- Parsing ---------------------------------------------------------------

export type ParseResult = { ok: true; data: ImportedCvData } | { ok: false; error: string }

export function parseImportedJson(raw: string): ParseResult {
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
    return { ok: false, error: 'El JSON debe ser un objeto { ... }, no una lista ni un texto suelto.' }
  }

  return { ok: true, data: parsed as ImportedCvData }
}

// ---- Normalization helpers ---------------------------------------------------

function bool(value: unknown): boolean {
  return value === true
}

/** Only overwrites `base` when the AI actually provided something — so importing on top
 * of an already partially-filled CV never blanks out fields the AI left empty/unknown. */
function mergeStr(base: string, incoming: unknown): string {
  const value = str(incoming)
  return value ? value : base
}

function normalizeSkillLevel(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.min(5, Math.max(1, Math.round(value)))
  if (typeof value === 'string') {
    const v = value.toLowerCase()
    const digit = v.match(/[1-5]/)
    if (digit) return Number(digit[0])
    if (/experto|nativ/.test(v)) return 5
    if (/avanzado/.test(v)) return 4
    if (/competente|bueno/.test(v)) return 3
    if (/intermedio/.test(v)) return 2
    if (/b[aá]sico|principiante/.test(v)) return 1
  }
  return 3
}

/** Strips protocol/www/trailing slash so equivalent URLs compare equal regardless of
 * how the AI formatted them (e.g. "linkedin.com/in/x" vs "https://www.linkedin.com/in/x/"). */
function normalizeUrlForDedupe(url: string): string {
  return url
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
}

const CONTACT_LABEL_PATTERN = /^(e-?mail|correo(\s+electr[oó]nico)?|tel[eé]fono|phone|tel|m[oó]vil)$/i

/** The AI sometimes lists email/phone twice — once correctly in "personal", again as a
 * "link" because the source text had it sitting next to LinkedIn/GitHub in a contact
 * block. Drops any link that's really just a restated email/phone, by label or by the
 * URL itself containing the (already-merged) email/phone value. */
function isContactDuplicateLink(link: { label?: string; url?: string }, email: string, phone: string): boolean {
  const label = str(link.label)
  if (CONTACT_LABEL_PATTERN.test(label)) return true

  const url = str(link.url).toLowerCase()
  if (!url) return false
  if (email && url.includes(email.toLowerCase())) return true
  const phoneDigits = phone.replace(/\D/g, '')
  if (phoneDigits.length >= 6 && url.replace(/\D/g, '').includes(phoneDigits)) return true
  return false
}

function normalizeLanguageLevel(value: unknown): string {
  const s = str(value)
  if (!s) return ''
  const exact = LANGUAGE_LEVELS.find((l) => l.toLowerCase() === s.toLowerCase())
  if (exact) return exact
  if (/nativ/i.test(s)) return 'Nativo'
  const code = s.toUpperCase().match(/^(A1|A2|B1|B2|C1|C2)\b/)?.[1]
  if (code) {
    const byCode = LANGUAGE_LEVELS.find((l) => l.startsWith(code))
    if (byCode) return byCode
  }
  return s
}

// ---- Merge into a CvDocument ---------------------------------------------------

export interface ImportCounts {
  skills: number | null
  languages: number | null
  education: number | null
  experience: number | null
  projects: number | null
  certifications: number | null
  links: number | null
  personalUpdated: boolean
}

export interface ImportResult {
  document: CvDocument
  counts: ImportCounts
}

/** Merges parsed AI data onto `base`: personal fields only overwrite when non-empty,
 * list sections are replaced wholesale (with fresh ids) whenever the key is present —
 * that's the whole point of an import: incorporate everything in one go. */
export function buildImportedDocument(base: CvDocument, data: ImportedCvData): ImportResult {
  const p = data.personal ?? {}
  const nextPersonal = {
    ...base.personal,
    firstName: mergeStr(base.personal.firstName, p.firstName),
    lastName: mergeStr(base.personal.lastName, p.lastName),
    title: mergeStr(base.personal.title, p.title),
    email: mergeStr(base.personal.email, p.email),
    phone: mergeStr(base.personal.phone, p.phone),
    location: mergeStr(base.personal.location, p.location),
    summary: mergeStr(base.personal.summary, p.summary),
  }
  const personalUpdated = JSON.stringify(nextPersonal) !== JSON.stringify(base.personal)

  const document: CvDocument = { ...base, personal: nextPersonal }
  const counts: ImportCounts = {
    skills: null,
    languages: null,
    education: null,
    experience: null,
    projects: null,
    certifications: null,
    links: null,
    personalUpdated,
  }

  if (Array.isArray(data.skills)) {
    document.skills = data.skills
      .filter((s) => str(s?.name))
      .map((s): Skill => ({ id: genId(), name: str(s.name), level: normalizeSkillLevel(s.level) }))
    counts.skills = document.skills.length
  }

  if (Array.isArray(data.languages)) {
    document.languages = data.languages
      .filter((l) => str(l?.name))
      .map((l): Language => ({ id: genId(), name: str(l.name), level: normalizeLanguageLevel(l.level) || 'B1 · Intermedio' }))
    counts.languages = document.languages.length
  }

  if (Array.isArray(data.education)) {
    document.education = data.education
      .filter((e) => str(e?.institution) || str(e?.degree))
      .map((e): EducationEntry => {
        const current = bool(e.current)
        return {
          id: genId(),
          institution: str(e.institution),
          degree: str(e.degree),
          field: str(e.field),
          location: str(e.location),
          startDate: str(e.startDate),
          endDate: current ? '' : str(e.endDate),
          current,
          description: str(e.description),
        }
      })
    counts.education = document.education.length
  }

  if (Array.isArray(data.experience)) {
    document.experience = data.experience
      .filter((e) => str(e?.company) || str(e?.position))
      .map((e): ExperienceEntry => {
        const current = bool(e.current)
        return {
          id: genId(),
          company: str(e.company),
          position: str(e.position),
          location: str(e.location),
          startDate: str(e.startDate),
          endDate: current ? '' : str(e.endDate),
          current,
          description: str(e.description),
        }
      })
    counts.experience = document.experience.length
  }

  if (Array.isArray(data.projects)) {
    document.projects = data.projects
      .filter((p) => str(p?.name))
      .map((p): ProjectEntry => ({ id: genId(), name: str(p.name), description: str(p.description), url: str(p.url) }))
    counts.projects = document.projects.length
  }

  if (Array.isArray(data.certifications)) {
    document.certifications = data.certifications
      .filter((c) => str(c?.name))
      .map((c): CertificationEntry => ({ id: genId(), name: str(c.name), issuer: str(c.issuer), date: str(c.date) }))
    counts.certifications = document.certifications.length
  }

  if (Array.isArray(data.links)) {
    const seen = new Set<string>()
    document.links = data.links
      .filter((l) => str(l?.url) || str(l?.label))
      .filter((l) => !isContactDuplicateLink(l, nextPersonal.email, nextPersonal.phone))
      .map((l): LinkEntry => ({ id: genId(), label: str(l.label), url: str(l.url) }))
      .filter((l) => {
        // Also drops entries the AI repeated verbatim (e.g. LinkedIn mentioned both in
        // a header and again in a "redes" section of the pasted source). `key` is never
        // empty here — the earlier filter already requires a non-empty url or label.
        const key = normalizeUrlForDedupe(l.url) || l.label.toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
    counts.links = document.links.length
  }

  return { document, counts }
}

const COUNT_LABELS: Record<Exclude<keyof ImportCounts, 'personalUpdated'>, [string, string]> = {
  skills: ['habilidad', 'habilidades'],
  languages: ['idioma', 'idiomas'],
  education: ['formación', 'formaciones'],
  experience: ['experiencia', 'experiencias'],
  projects: ['proyecto', 'proyectos'],
  certifications: ['certificación', 'certificaciones'],
  links: ['enlace', 'enlaces'],
}

/** Human-readable summary lines for the "se ha importado…" confirmation message. */
export function summarizeImportCounts(counts: ImportCounts): string[] {
  const lines: string[] = []
  if (counts.personalUpdated) lines.push('Datos personales actualizados')
  for (const key of Object.keys(COUNT_LABELS) as (keyof typeof COUNT_LABELS)[]) {
    const count = counts[key]
    if (count === null) continue
    const [singular, plural] = COUNT_LABELS[key]
    lines.push(`${count} ${count === 1 ? singular : plural}`)
  }
  return lines
}
