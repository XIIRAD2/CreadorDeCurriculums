import type { CvDocument } from '@/types/cv'
import { getSpacing } from '@/lib/themeRuntime'
import { getContrastText } from '@/lib/color'
import { ContactInfo } from '@/components/preview/ContactInfo'
import { Avatar } from '@/components/preview/AvatarPlaceholder'
import { CornerPhoto } from '@/components/preview/CornerPhoto'
import { SECTION_BLOCKS } from '@/components/preview/sectionBlocks'
import { sectionHasContent } from '@/lib/sections'

export function MinimalTemplate({ cv }: { cv: CvDocument }) {
  const { theme } = cv
  const spacing = getSpacing(theme.density)
  const headerText = getContrastText(theme.primaryColor)
  const sections = cv.sectionOrder.filter((id) => !cv.hiddenSections.includes(id) && sectionHasContent(cv, id))
  const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`.trim()
  const headerPad = spacing.pagePadding * 0.7

  return (
    <div className="flex flex-1 flex-col" style={{ fontFamily: theme.bodyFont, fontSize: 14 * theme.fontScale, color: theme.textColor }}>
      <header
        className="flex items-center gap-5"
        style={{ backgroundColor: theme.primaryColor, color: headerText, padding: headerPad }}
      >
        {theme.showPhoto &&
          (theme.photoShape === 'corner' ? (
            // Bleeds past the header's own top/left padding to reach the page's real
            // top-left corner — see the matching comment in SidebarTemplate.tsx.
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

      <div className="flex-1" style={{ padding: spacing.pagePadding }}>
        {sections.map((id) => {
          const Block = SECTION_BLOCKS[id]
          return <Block key={id} cv={cv} theme={theme} spacing={spacing} tone="page" />
        })}
        {sections.length === 0 && (
          <p className="text-sm italic opacity-40">
            Rellena el configurador de la izquierda: tu experiencia, educación y proyectos aparecerán aquí.
          </p>
        )}
      </div>
    </div>
  )
}
