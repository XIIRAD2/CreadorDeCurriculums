import type { CvDocument } from '@/types/cv'
import { getSpacing } from '@/lib/themeRuntime'
import { formatFullDate } from '@/lib/date'
import { DEFAULT_COVER_LETTER } from '@/lib/defaultData'
import { ContactInfo } from '@/components/preview/ContactInfo'

/** A single-column formal letter that deliberately reuses the CV's own theme (heading
 * color, fonts, density) instead of having a look of its own — the point is that the
 * pair reads as one matched set when both PDFs are attached to the same application. */
export function CoverLetterTemplate({ cv }: { cv: CvDocument }) {
  const { theme } = cv
  const spacing = getSpacing(theme.density)
  const letter = cv.coverLetter ?? DEFAULT_COVER_LETTER
  const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`.trim()
  const paragraphs = letter.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <div
      className="flex h-full flex-col"
      style={{ fontFamily: theme.bodyFont, fontSize: 14 * theme.fontScale, color: theme.textColor, padding: spacing.pagePadding }}
    >
      <header style={{ borderBottom: `3px solid ${theme.primaryColor}`, paddingBottom: spacing.itemGap }}>
        <h1 className="text-[1.6em] font-bold leading-tight" style={{ fontFamily: theme.headingFont, color: theme.primaryColor }}>
          {fullName || 'Tu nombre'}
        </h1>
        {cv.personal.title && <p className="mt-0.5 text-[0.95em] opacity-80">{cv.personal.title}</p>}
        <div className="mt-2.5">
          <ContactInfo personal={cv.personal} layout="inline" />
        </div>
      </header>

      {letter.date && <p className="mt-6 text-right text-[0.88em] opacity-70">{formatFullDate(letter.date)}</p>}

      {(letter.recipientName || letter.recipientCompany) && (
        <div className={`text-[0.95em] ${letter.date ? 'mt-3' : 'mt-6'}`}>
          {letter.recipientName && <div className="font-medium">{letter.recipientName}</div>}
          {letter.recipientCompany && <div className="opacity-80">{letter.recipientCompany}</div>}
        </div>
      )}

      {letter.greeting && <p className="mt-6 text-[0.95em]">{letter.greeting}</p>}

      <div className="mt-4 flex-1 text-[0.95em]" style={{ lineHeight: spacing.lineHeight }}>
        {paragraphs.length > 0 ? (
          <div className="space-y-3">
            {paragraphs.map((p, i) => (
              <p key={i} style={{ textAlign: 'justify', whiteSpace: 'pre-line' }}>
                {p}
              </p>
            ))}
          </div>
        ) : (
          <p className="italic opacity-40">
            Escribe el cuerpo de la carta en la pestaña "Carta" del configurador — cada párrafo va separado por una
            línea en blanco.
          </p>
        )}
      </div>

      <div className="mt-8 text-[0.95em]">
        {letter.closing && <p>{letter.closing}</p>}
        {fullName && (
          <p className="mt-2 font-medium" style={{ fontFamily: theme.headingFont }}>
            {fullName}
          </p>
        )}
      </div>
    </div>
  )
}
