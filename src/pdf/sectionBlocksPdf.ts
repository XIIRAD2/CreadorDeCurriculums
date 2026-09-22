import type { ComponentType } from 'react'
import type { SectionId } from '@/types/cv'
import {
  type BlockPdfProps,
  SummaryBlockPdf,
  ExperienceBlockPdf,
  EducationBlockPdf,
  SkillsBlockPdf,
  LanguagesBlockPdf,
  ProjectsBlockPdf,
  CertificationsBlockPdf,
  LinksBlockPdf,
} from '@/pdf/blocks'

export const SECTION_BLOCKS_PDF: Record<SectionId, ComponentType<BlockPdfProps>> = {
  summary: SummaryBlockPdf,
  experience: ExperienceBlockPdf,
  education: EducationBlockPdf,
  skills: SkillsBlockPdf,
  languages: LanguagesBlockPdf,
  projects: ProjectsBlockPdf,
  certifications: CertificationsBlockPdf,
  links: LinksBlockPdf,
}
