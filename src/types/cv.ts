/** Core data model for a CV document. Everything here is plain JSON so it can be
 * stored as-is in IndexedDB (via Dexie) and round-tripped through import/export. */

export interface Skill {
  id: string
  name: string
  /** 1 (básico) .. 5 (experto) */
  level: number
}

export interface Language {
  id: string
  name: string
  level: string
}

export interface EducationEntry {
  id: string
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface ExperienceEntry {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface ProjectEntry {
  id: string
  name: string
  description: string
  url: string
}

export interface CertificationEntry {
  id: string
  name: string
  issuer: string
  date: string
}

export interface LinkEntry {
  id: string
  label: string
  url: string
}

export interface PersonalInfo {
  firstName: string
  lastName: string
  title: string
  email: string
  phone: string
  location: string
  summary: string
  /** base64 data URL, or null when no photo was uploaded */
  photo: string | null
}

export type SectionId =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'projects'
  | 'certifications'
  | 'links'

export type TemplateId = 'sidebar' | 'minimal' | 'two-column' | 'elegant' | 'compact-ats' | 'custom'
/** 'corner' is a special case, not just another radius: no border/frame at all, and
 * sized/positioned by the template itself to fill the top-left corner of the page edge
 * to edge, rather than sitting as a small avatar inside the header's normal padding. */
export type PhotoShape = 'circle' | 'rounded' | 'square' | 'corner'
export type Density = 'compact' | 'comfortable' | 'spacious'
export type DescriptionStyle = 'paragraph' | 'bullets'

export interface FontPairing {
  id: string
  label: string
  heading: string
  body: string
}

export interface CvTheme {
  templateId: TemplateId
  paletteId: string
  primaryColor: string
  accentColor: string
  textColor: string
  fontPairingId: string
  headingFont: string
  bodyFont: string
  fontScale: number
  density: Density
  photoShape: PhotoShape
  showPhoto: boolean
  /** Multiplier (1 = the template's normal size) on how big the profile photo's own
   * bounding box is — the "Tamaño de la foto" slider in Diseño, shown for every photo
   * shape (CornerPhoto.tsx for 'corner', Avatar.tsx for the rest). It grows/shrinks the
   * box itself (not just what's visible inside it), same box `object-fit: cover` already
   * crops to — bigger just shows more of the picture instead of zooming into it. Every
   * caller sits the box inside a centered/`items-center` flex layout, so growing it
   * expands outward from that centered position rather than from one fixed edge, and the
   * surrounding layout reflows around it instead of the box spilling past it. Optional
   * for backward compatibility — treat a missing value as 1. */
  photoZoom?: number
  /** Whether skills show a level bar underneath. Optional for backward compatibility
   * with CVs saved before this setting existed — treat anything but `false` as "show". */
  showSkillBar?: boolean
  /** Whether skills show their level as text (e.g. "Avanzado") next to the name. Optional
   * for backward compatibility — treat anything but `false` as "show". */
  showSkillLevel?: boolean
  /** How experience/education/project descriptions render. Optional for backward
   * compatibility — treat a missing value as 'paragraph'. Bullets read better both for
   * recruiters scanning quickly and for ATS keyword extraction. */
  descriptionStyle?: DescriptionStyle
}

/** One column in a column-based template (Barra lateral, Dos columnas, Personalizada) —
 * which sections it holds (in order) and how wide it is. Lives on `CvDocument`, not
 * `CvTheme`, alongside `sectionOrder`/`hiddenSections`: it's the same kind of "layout of
 * sections" data, just split across columns instead of one flat list. See
 * `lib/columns.ts`'s `getEffectiveColumns` for the one place that reconciles this against
 * `sectionOrder`/`hiddenSections` (and falls back to a 35/65 default when absent). */
export interface ColumnLayout {
  id: string
  widthPercent: number
  sectionIds: SectionId[]
}

/** A cover letter paired 1:1 with its CV — lives inside the same document (not a
 * separate table) precisely so it always travels together with the CV it belongs to
 * and automatically shares its look (theme colors, fonts) for a matching pair. `enabled`
 * just controls whether it shows up in the preview/export UI; the content underneath is
 * kept even while disabled, so toggling it back on never loses anything typed in. */
export interface CoverLetterContent {
  enabled: boolean
  recipientName: string
  recipientCompany: string
  /** YYYY-MM-DD, or '' to not print a date line. */
  date: string
  greeting: string
  body: string
  closing: string
}

export interface CvDocument {
  id: string
  name: string
  targetCompany: string
  createdAt: number
  updatedAt: number
  personal: PersonalInfo
  skills: Skill[]
  languages: Language[]
  education: EducationEntry[]
  experience: ExperienceEntry[]
  projects: ProjectEntry[]
  certifications: CertificationEntry[]
  links: LinkEntry[]
  sectionOrder: SectionId[]
  hiddenSections: SectionId[]
  /** Optional for backward compatibility with CVs saved before columns were editable —
   * treat a missing/empty value as the old fixed 35/65 split (see `lib/columns.ts`'s
   * `DEFAULT_COLUMNS`). Only meaningful for column-based templates; single-column
   * templates (Minimal, Elegante, ATS compacta) ignore it entirely. */
  columns?: ColumnLayout[]
  theme: CvTheme
  /** Optional for backward compatibility with CVs saved before this feature existed —
   * treat a missing value as "no cover letter yet" (see lib/defaultData.ts's
   * DEFAULT_COVER_LETTER for the fallback used everywhere this is read). */
  coverLetter?: CoverLetterContent
}

export const SECTION_LABELS: Record<SectionId, string> = {
  summary: 'Perfil profesional',
  experience: 'Experiencia laboral',
  education: 'Educación',
  skills: 'Habilidades',
  languages: 'Idiomas',
  projects: 'Proyectos',
  certifications: 'Certificaciones',
  links: 'Enlaces',
}
