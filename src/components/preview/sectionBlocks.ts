import type { ComponentType } from 'react'
import type { SectionId } from '@/types/cv'
import {
  type BlockProps,
  SummaryBlock,
  ExperienceBlock,
  EducationBlock,
  SkillsBlock,
  LanguagesBlock,
  ProjectsBlock,
  CertificationsBlock,
  LinksBlock,
} from '@/components/preview/blocks'

export const SECTION_BLOCKS: Record<SectionId, ComponentType<BlockProps>> = {
  summary: SummaryBlock,
  experience: ExperienceBlock,
  education: EducationBlock,
  skills: SkillsBlock,
  languages: LanguagesBlock,
  projects: ProjectsBlock,
  certifications: CertificationsBlock,
  links: LinksBlock,
}
