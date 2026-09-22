import type { ComponentType } from 'react'
import type { SectionId } from '@/types/cv'
import { type PdfIconProps, ICON_COMPONENTS_PDF } from '@/pdf/icons'

export const SECTION_ICONS_PDF: Record<SectionId, ComponentType<PdfIconProps>> = {
  summary: ICON_COMPONENTS_PDF.UserIcon,
  experience: ICON_COMPONENTS_PDF.BriefcaseIcon,
  education: ICON_COMPONENTS_PDF.GraduationCapIcon,
  skills: ICON_COMPONENTS_PDF.SparklesIcon,
  languages: ICON_COMPONENTS_PDF.GlobeIcon,
  projects: ICON_COMPONENTS_PDF.FolderIcon,
  certifications: ICON_COMPONENTS_PDF.AwardIcon,
  links: ICON_COMPONENTS_PDF.LinkIcon,
}
