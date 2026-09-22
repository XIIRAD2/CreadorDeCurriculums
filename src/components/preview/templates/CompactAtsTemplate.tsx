import type { CvDocument } from '@/types/cv'
import { getSpacing } from '@/lib/themeRuntime'
import { ContactInfo } from '@/components/preview/ContactInfo'
import { SECTION_BLOCKS } from '@/components/preview/sectionBlocks'
import { sectionHasContent } from '@/lib/sections'

/** No colored bands, no photo — the most conservative, printer- and ATS-parser-friendly
 * layout of the five. Deliberately never renders a photo regardless of the global
 * "Mostrar foto" setting: a plain, photo-free single column is the safest default for
 * ATS parsing and for the countries where a resume photo is discouraged, which is the
 * entire reason this template exists as a distinct option. The theme's accent color
 * still shows, just as a thin rule under the name rather than a filled block. */
export function CompactAtsTemplate({ cv }: { cv: CvDocument }) {
  const { theme } = cv
  const spacing = getSpacing(theme.density)
  const sections = cv.sectionOrder.filter((id) => !cv.hiddenSections.includes(id) && sectionHasContent(cv, id))
  const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`.trim()

  return (
    <div
      className="flex flex-1 flex-col"
      style={{ fontFamily: theme.bodyFont, fontSize: 14 * theme.fontScale, color: theme.textColor, padding: spacing.pagePadding }}
    >
      <header className="border-b-2 pb-3" style={{ borderColor: theme.primaryColor }}>
        <h1 className="text-[1.7em] font-bold" style={{ fontFamily: theme.headingFont }}>
          {fullName || 'Tu nombre'}
        </h1>
        <p className="mt-0.5 text-[0.95em] opacity-70">{cv.personal.title || 'Tu puesto profesional'}</p>
        <div className="mt-2">
          <ContactInfo personal={cv.personal} layout="inline" />
        </div>
      </header>

      <div className="mt-4">
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
