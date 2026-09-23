import type { CvDocument, CoverLetterContent, SectionId } from '@/types/cv'
import { genId } from '@/lib/id'
import { DEFAULT_PALETTE } from '@/lib/palettes'
import { DEFAULT_FONT_PAIRING } from '@/lib/fonts'
import { DEFAULT_COLUMNS } from '@/lib/columns'

/** Fallback used wherever `cv.coverLetter` is read — covers CVs saved before this field
 * existed (see the optional-field comment on CoverLetterContent's home in types/cv.ts). */
export const DEFAULT_COVER_LETTER: CoverLetterContent = {
  enabled: false,
  recipientName: '',
  recipientCompany: '',
  date: '',
  greeting: '',
  body: '',
  closing: 'Atentamente,',
}

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  'summary',
  'experience',
  'education',
  'skills',
  'languages',
  'projects',
  'certifications',
  'links',
]

export function createEmptyCv(name = 'Mi currículum'): CvDocument {
  const now = Date.now()
  return {
    id: genId(),
    name,
    targetCompany: '',
    createdAt: now,
    updatedAt: now,
    personal: {
      firstName: '',
      lastName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      photo: null,
    },
    skills: [],
    languages: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    links: [],
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    hiddenSections: [],
    columns: DEFAULT_COLUMNS.map((c) => ({ ...c, sectionIds: [...c.sectionIds] })),
    coverLetter: { ...DEFAULT_COVER_LETTER },
    theme: {
      templateId: 'sidebar',
      paletteId: DEFAULT_PALETTE.id,
      primaryColor: DEFAULT_PALETTE.primary,
      accentColor: DEFAULT_PALETTE.accent,
      textColor: DEFAULT_PALETTE.text,
      fontPairingId: DEFAULT_FONT_PAIRING.id,
      headingFont: DEFAULT_FONT_PAIRING.heading,
      bodyFont: DEFAULT_FONT_PAIRING.body,
      fontScale: 1,
      density: 'comfortable',
      photoShape: 'circle',
      showPhoto: true,
      photoZoom: 1,
      showSkillBar: true,
      showSkillLevel: true,
      descriptionStyle: 'paragraph',
    },
  }
}

export function cloneCv(source: CvDocument, name: string): CvDocument {
  const now = Date.now()
  return {
    ...structuredClone(source),
    id: genId(),
    name,
    createdAt: now,
    updatedAt: now,
  }
}
