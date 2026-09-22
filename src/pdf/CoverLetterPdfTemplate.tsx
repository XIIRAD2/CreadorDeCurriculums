import { View, Text } from '@react-pdf/renderer'
import type { CvDocument } from '@/types/cv'
import { getSpacing } from '@/lib/themeRuntime'
import { formatFullDate } from '@/lib/date'
import { DEFAULT_COVER_LETTER } from '@/lib/defaultData'
import { getPdfFontFamilies } from '@/pdf/fonts'
import { pt, em } from '@/pdf/units'
import { ContactInfoPdf } from '@/pdf/ContactInfoPdf'

/** Mirrors preview/CoverLetterTemplate.tsx value-for-value — same reasoning: this
 * intentionally shares the CV's own theme rather than having its own look, so the pair
 * reads as one matched set. */
export function CoverLetterPdfTemplate({ cv }: { cv: CvDocument }) {
  const { theme } = cv
  const spacing = getSpacing(theme.density)
  const fonts = getPdfFontFamilies(theme.fontPairingId)
  const letter = cv.coverLetter ?? DEFAULT_COVER_LETTER
  const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`.trim()
  const paragraphs = letter.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <View style={{ flexGrow: 1, padding: pt(spacing.pagePadding), fontFamily: fonts.body }}>
      <View style={{ borderBottomWidth: pt(3), borderBottomColor: theme.primaryColor, paddingBottom: pt(spacing.itemGap) }}>
        {fullName && (
          <Text style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: em(1.6, theme.fontScale), color: theme.primaryColor }}>
            {fullName}
          </Text>
        )}
        {cv.personal.title && (
          <Text style={{ fontFamily: fonts.body, fontSize: em(0.95, theme.fontScale), color: theme.textColor, marginTop: pt(2) }}>
            {cv.personal.title}
          </Text>
        )}
        <ContactInfoPdf personal={cv.personal} fontFamily={fonts.body} fontScale={theme.fontScale} layout="inline" color={theme.textColor} />
      </View>

      {letter.date && (
        <Text style={{ fontFamily: fonts.body, fontSize: em(0.88, theme.fontScale), color: theme.textColor, opacity: 0.7, textAlign: 'right', marginTop: pt(24) }}>
          {formatFullDate(letter.date)}
        </Text>
      )}

      {(letter.recipientName || letter.recipientCompany) && (
        <View style={{ marginTop: letter.date ? pt(12) : pt(24) }}>
          {letter.recipientName && (
            <Text style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: em(0.95, theme.fontScale), color: theme.textColor }}>
              {letter.recipientName}
            </Text>
          )}
          {letter.recipientCompany && (
            <Text style={{ fontFamily: fonts.body, fontSize: em(0.95, theme.fontScale), color: theme.textColor, opacity: 0.8 }}>
              {letter.recipientCompany}
            </Text>
          )}
        </View>
      )}

      {letter.greeting && (
        <Text style={{ fontFamily: fonts.body, fontSize: em(0.95, theme.fontScale), color: theme.textColor, marginTop: pt(24) }}>
          {letter.greeting}
        </Text>
      )}

      <View style={{ marginTop: pt(16), flexGrow: 1 }}>
        {paragraphs.map((p, i) => (
          <Text
            key={i}
            style={{
              fontFamily: fonts.body,
              fontSize: em(0.95, theme.fontScale),
              lineHeight: spacing.lineHeight,
              color: theme.textColor,
              textAlign: 'justify',
              marginTop: i === 0 ? 0 : pt(12),
            }}
          >
            {p}
          </Text>
        ))}
      </View>

      <View style={{ marginTop: pt(32) }}>
        {letter.closing && (
          <Text style={{ fontFamily: fonts.body, fontSize: em(0.95, theme.fontScale), color: theme.textColor }}>{letter.closing}</Text>
        )}
        {fullName && (
          <Text style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: em(0.95, theme.fontScale), color: theme.textColor, marginTop: pt(8) }}>
            {fullName}
          </Text>
        )}
      </View>
    </View>
  )
}
