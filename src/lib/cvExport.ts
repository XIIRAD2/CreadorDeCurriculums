import type { CvDocument } from '@/types/cv'
import type { ImportedCvData } from '@/lib/importSchema'

/** The inverse of buildImportedDocument (lib/importCv.ts) — turns a CvDocument back
 * into the exact same shape the AI-import prompt asks for. That symmetry is the whole
 * point: a CV exported here can be pasted straight back into "Importar con IA" (after
 * hand-editing, or handing it to an AI to tweak) with zero format mismatch. Deliberately
 * excludes ids, theme, section order… — this is the CV's *content*, not its config
 * (see lib/cvConfig.ts for that, exported separately on purpose). */
export function cvToImportedShape(cv: CvDocument): ImportedCvData {
  return {
    personal: {
      firstName: cv.personal.firstName,
      lastName: cv.personal.lastName,
      title: cv.personal.title,
      email: cv.personal.email,
      phone: cv.personal.phone,
      location: cv.personal.location,
      summary: cv.personal.summary,
    },
    skills: cv.skills.map((s) => ({ name: s.name, level: s.level })),
    languages: cv.languages.map((l) => ({ name: l.name, level: l.level })),
    education: cv.education.map((e) => ({
      institution: e.institution,
      degree: e.degree,
      field: e.field,
      location: e.location,
      startDate: e.startDate,
      endDate: e.endDate,
      current: e.current,
      description: e.description,
    })),
    experience: cv.experience.map((e) => ({
      company: e.company,
      position: e.position,
      location: e.location,
      startDate: e.startDate,
      endDate: e.endDate,
      current: e.current,
      description: e.description,
    })),
    projects: cv.projects.map((p) => ({ name: p.name, description: p.description, url: p.url })),
    certifications: cv.certifications.map((c) => ({ name: c.name, issuer: c.issuer, date: c.date })),
    links: cv.links.map((l) => ({ label: l.label, url: l.url })),
  }
}

/** Filesystem-safe, readable filename from a CV's name — "CV - Backend - Acme Corp"
 * becomes "cv-backend-acme-corp.json". */
export function cvFileSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents (combining diacritical marks)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'curriculum'
}
