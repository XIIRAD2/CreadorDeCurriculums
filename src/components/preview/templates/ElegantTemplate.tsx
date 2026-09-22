import type { CvDocument } from '@/types/cv'
import { getSpacing } from '@/lib/themeRuntime'
import { ContactInfo } from '@/components/preview/ContactInfo'
import { Avatar } from '@/components/preview/AvatarPlaceholder'
import { SECTION_BLOCKS } from '@/components/preview/sectionBlocks'
import { sectionHasContent } from '@/lib/sections'

/** A centered, editorial header — no colored band, just the accent color as a short
 * rule under the name — for a more designed/portfolio feel. The body stays a single
 * column using the same section blocks as every other template (only the header differs;
 * a fully centered body would mean forking SectionTitle's alignment too, which isn't
 * worth the coupling for what's still a real, distinctly different template). */
export function ElegantTemplate({ cv }: { cv: CvDocument }) {
  const { theme } = cv
  const spacing = getSpacing(theme.density)
  const sections = cv.sectionOrder.filter((id) => !cv.hiddenSections.includes(id) && sectionHasContent(cv, id))
  const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`.trim()

  return (
    <div
      className="flex flex-1 flex-col items-center"
      style={{ fontFamily: theme.bodyFont, fontSize: 14 * theme.fontScale, color: theme.textColor, padding: spacing.pagePadding }}
    >
      {theme.showPhoto && (
        <div className="mb-4">
          <Avatar personal={cv.personal} shape={theme.photoShape} size={100 * (theme.photoZoom ?? 1)} />
        </div>
      )}
      <h1 className="text-center text-[2em] font-bold tracking-wide" style={{ fontFamily: theme.headingFont }}>
        {fullName || 'Tu nombre'}
      </h1>
      <p className="mt-1 text-center text-[0.95em] uppercase tracking-[0.2em] opacity-70">
        {cv.personal.title || 'Tu puesto profesional'}
      </p>
      <div className="my-3 h-[3px] w-16 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
      <div className="mb-6">
        <ContactInfo personal={cv.personal} layout="inline" />
      </div>

      <div className="w-full">
        {sections.map((id) => {
          const Block = SECTION_BLOCKS[id]
          return <Block key={id} cv={cv} theme={theme} spacing={spacing} tone="page" />
        })}
        {sections.length === 0 && (
          <p className="text-center text-sm italic opacity-40">
            Rellena el configurador de la izquierda: tu experiencia, educación y proyectos aparecerán aquí.
          </p>
        )}
      </div>
    </div>
  )
}
