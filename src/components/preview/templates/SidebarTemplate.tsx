import type { CvDocument } from '@/types/cv'
import { getSpacing } from '@/lib/themeRuntime'
import { getContrastText } from '@/lib/color'
import { sectionHasContent } from '@/lib/sections'
import { getTwoSlotColumns } from '@/lib/columns'
import { ContactInfo } from '@/components/preview/ContactInfo'
import { Avatar } from '@/components/preview/AvatarPlaceholder'
import { CornerPhoto } from '@/components/preview/CornerPhoto'
import { SECTION_BLOCKS } from '@/components/preview/sectionBlocks'

export function SidebarTemplate({ cv }: { cv: CvDocument }) {
  const { theme } = cv
  const spacing = getSpacing(theme.density)
  const sidebarText = getContrastText(theme.primaryColor)
  const asidePad = spacing.pagePadding * 0.75

  const [sidebarColumn, mainColumn] = getTwoSlotColumns(cv)
  const sidebarSections = sidebarColumn.sectionIds.filter((id) => sectionHasContent(cv, id))
  const mainSections = mainColumn.sectionIds.filter((id) => sectionHasContent(cv, id))

  const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`.trim()

  return (
    <div className="flex flex-1" style={{ fontFamily: theme.bodyFont, fontSize: 14 * theme.fontScale, color: theme.textColor }}>
      <aside
        className="flex shrink-0 flex-col"
        style={{ width: `${sidebarColumn.widthPercent}%`, backgroundColor: theme.primaryColor, color: sidebarText, padding: asidePad }}
      >
        {theme.showPhoto && theme.photoShape === 'corner' ? (
          // Negative margin "bleeds" the photo past the aside's own padding on three
          // sides so it reaches the true top-left corner of the page instead of sitting
          // inside the padded box like the other shapes — no border, no radius.
          // Height scales with photoZoom: a landscape box crops hard into a portrait
          // photo's face with object-cover, so letting it grow shows more of the picture.
          <div style={{ margin: `-${asidePad}px -${asidePad}px 16px -${asidePad}px` }}>
            <CornerPhoto personal={cv.personal} width="100%" height={170 * (theme.photoZoom ?? 1)} />
          </div>
        ) : (
          theme.showPhoto && (
            <div className="mb-4 flex justify-center">
              <Avatar personal={cv.personal} shape={theme.photoShape} size={110 * (theme.photoZoom ?? 1)} />
            </div>
          )
        )}

        <div className="mb-5 text-center">
          <h1 className="text-[1.45em] font-bold leading-tight" style={{ fontFamily: theme.headingFont }}>
            {fullName || 'Tu nombre'}
          </h1>
          <p className="mt-1 text-[0.9em] opacity-85">{cv.personal.title || 'Tu puesto profesional'}</p>
        </div>

        <div className="mb-5">
          <ContactInfo personal={cv.personal} layout="stacked" />
        </div>

        {sidebarSections.map((id) => {
          const Block = SECTION_BLOCKS[id]
          return <Block key={id} cv={cv} theme={theme} spacing={spacing} tone="sidebar" />
        })}
      </aside>

      <main className="flex-1" style={{ padding: spacing.pagePadding }}>
        {mainSections.map((id) => {
          const Block = SECTION_BLOCKS[id]
          return <Block key={id} cv={cv} theme={theme} spacing={spacing} tone="page" />
        })}
        {mainSections.length === 0 && (
          <p className="text-sm italic opacity-40">
            Rellena el configurador de la izquierda: tu experiencia, educación y proyectos aparecerán aquí.
          </p>
        )}
      </main>
    </div>
  )
}
