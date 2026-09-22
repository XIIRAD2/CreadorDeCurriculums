import type { CvDocument, SectionId } from '@/types/cv'

/** In the sidebar template, these sections live in the colored side column; everything
 * else flows in the main column. The minimal template ignores this split entirely. */
export const SIDEBAR_SECTIONS: SectionId[] = ['skills', 'languages', 'certifications', 'links']
export const MAIN_SECTIONS: SectionId[] = ['summary', 'experience', 'education', 'projects']

/** Whether a given section currently has anything worth rendering (used to skip empty
 * sections instead of showing hollow headings in the preview). */
export function sectionHasContent(cv: CvDocument, id: SectionId): boolean {
  switch (id) {
    case 'summary':
      return cv.personal.summary.trim().length > 0
    case 'experience':
      return cv.experience.length > 0
    case 'education':
      return cv.education.length > 0
    case 'skills':
      return cv.skills.length > 0
    case 'languages':
      return cv.languages.length > 0
    case 'projects':
      return cv.projects.length > 0
    case 'certifications':
      return cv.certifications.length > 0
    case 'links':
      return cv.links.length > 0
  }
}
