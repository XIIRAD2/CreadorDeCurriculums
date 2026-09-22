import type { CvDocument } from '@/types/cv'
import { getSpacing } from '@/lib/themeRuntime'
import { getContrastText } from '@/lib/color'
import { SIDEBAR_SECTIONS, MAIN_SECTIONS, sectionHasContent } from '@/lib/sections'
import { ContactInfo } from '@/components/preview/ContactInfo'
import { Avatar } from '@/components/preview/AvatarPlaceholder'
import { CornerPhoto } from '@/components/preview/CornerPhoto'
import { SECTION_BLOCKS } from '@/components/preview/sectionBlocks'

/** A full-width colored header (unlike Sidebar's full-height side panel) followed by two
 * plain white columns — the same "list column vs. narrative column" split as Sidebar,
 * just lighter and less boxed-in. Reuses SIDEBAR_SECTIONS/MAIN_SECTIONS from
 * lib/sections.ts for that split even though nothing here is an actual sidebar; it's the
 * same grouping decision either way. */
export function TwoColumnTemplate({ cv }: { cv: CvDocument }) {
  const { theme } = cv
  const spacing = getSpacing(theme.density)
  const headerText = getContrastText(theme.primaryColor)

  const listSections = cv.sectionOrder.filter(
    (id) => SIDEBAR_SECTIONS.includes(id) && !cv.hiddenSections.includes(id) && sectionHasContent(cv, id),
  )
  const mainSections = cv.sectionOrder.filter(
    (id) => MAIN_SECTIONS.includes(id) && !cv.hiddenSections.includes(id) && sectionHasContent(cv, id),
  )
  const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`.trim()
  const headerPad = spacing.pagePadding * 0.7

  return (
    <div className="flex flex-1 flex-col" style={{ fontFamily: theme.bodyFont, fontSize: 14 * theme.fontScale, color: theme.textColor }}>
      <header className="flex items-center gap-5" style={{ backgroundColor: theme.primaryColor, color: headerText, padding: headerPad }}>
        {theme.showPhoto &&
          (theme.photoShape === 'corner' ? (
            <div style={{ margin: `-${headerPad}px 0 0 -${headerPad}px` }}>
              <CornerPhoto
                personal={cv.personal}
                width={110 * (theme.photoZoom ?? 1)}
                height={110 * (theme.photoZoom ?? 1)}
              />
            </div>
          ) : (
            <Avatar personal={cv.personal} shape={theme.photoShape} size={92 * (theme.photoZoom ?? 1)} />
          ))}
        <div className="min-w-0 flex-1">
          <h1 className="text-[1.6em] font-bold leading-tight" style={{ fontFamily: theme.headingFont }}>
            {fullName || 'Tu nombre'}
          </h1>
          <p className="mt-0.5 text-[0.95em] opacity-85">{cv.personal.title || 'Tu puesto profesional'}</p>
          <div className="mt-2.5">
            <ContactInfo personal={cv.personal} layout="inline" />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <div className="w-[35%] shrink-0 border-r border-black/10" style={{ padding: spacing.pagePadding * 0.85 }}>
          {listSections.map((id) => {
            const Block = SECTION_BLOCKS[id]
            return <Block key={id} cv={cv} theme={theme} spacing={spacing} tone="page" />
          })}
        </div>
        <div className="flex-1" style={{ padding: spacing.pagePadding }}>
          {mainSections.map((id) => {
            const Block = SECTION_BLOCKS[id]
            return <Block key={id} cv={cv} theme={theme} spacing={spacing} tone="page" />
          })}
          {mainSections.length === 0 && (
            <p className="text-sm italic opacity-40">
              Rellena el configurador de la izquierda: tu experiencia, educación y proyectos aparecerán aquí.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
