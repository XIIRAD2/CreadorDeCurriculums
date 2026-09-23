import type { CvDocument } from '@/types/cv'
import { getSpacing } from '@/lib/themeRuntime'
import { getContrastText } from '@/lib/color'
import { sectionHasContent } from '@/lib/sections'
import { getEffectiveColumns } from '@/lib/columns'
import { ContactInfo } from '@/components/preview/ContactInfo'
import { Avatar } from '@/components/preview/AvatarPlaceholder'
import { CornerPhoto } from '@/components/preview/CornerPhoto'
import { SECTION_BLOCKS } from '@/components/preview/sectionBlocks'

/** Same header band as "Dos columnas", but the body underneath is however many columns
 * (1-4) the user set up in Diseño → Secciones, each at its own width — plain white, no
 * per-column chrome, since it's meant as the free-form option rather than a distinct
 * visual style of its own. */
export function CustomTemplate({ cv }: { cv: CvDocument }) {
  const { theme } = cv
  const spacing = getSpacing(theme.density)
  const headerText = getContrastText(theme.primaryColor)
  const columns = getEffectiveColumns(cv)
  const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`.trim()
  const headerPad = spacing.pagePadding * 0.7
  const hasAnyContent = columns.some((col) => col.sectionIds.some((id) => sectionHasContent(cv, id)))

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
        {columns.map((col, i) => {
          const sectionIds = col.sectionIds.filter((id) => sectionHasContent(cv, id))
          return (
            <div
              key={col.id}
              className={i > 0 ? 'border-l border-black/10' : ''}
              style={{ width: `${col.widthPercent}%`, padding: spacing.pagePadding * 0.85 }}
            >
              {sectionIds.map((id) => {
                const Block = SECTION_BLOCKS[id]
                return <Block key={id} cv={cv} theme={theme} spacing={spacing} tone="page" />
              })}
            </div>
          )
        })}
        {!hasAnyContent && (
          <p className="p-5 text-sm italic opacity-40">
            Rellena el configurador de la izquierda: tu experiencia, educación y proyectos aparecerán aquí.
          </p>
        )}
      </div>
    </div>
  )
}
