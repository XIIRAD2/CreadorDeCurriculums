import { View, Text } from '@react-pdf/renderer'
import type { CvDocument } from '@/types/cv'
import { getSpacing } from '@/lib/themeRuntime'
import { withAlpha } from '@/lib/color'
import { sectionHasContent } from '@/lib/sections'
import { getPdfFontFamilies } from '@/pdf/fonts'
import { pt, em } from '@/pdf/units'
import { ContactInfoPdf } from '@/pdf/ContactInfoPdf'
import { SECTION_BLOCKS_PDF } from '@/pdf/sectionBlocksPdf'

/** Mirrors templates/CompactAtsTemplate.tsx value-for-value — including never rendering
 * a photo, regardless of theme.showPhoto (see that file's comment for why). */
export function CompactAtsPdfTemplate({ cv }: { cv: CvDocument }) {
  const { theme } = cv
  const spacing = getSpacing(theme.density)
  const fonts = getPdfFontFamilies(theme.fontPairingId)
  const sections = cv.sectionOrder.filter((id) => !cv.hiddenSections.includes(id) && sectionHasContent(cv, id))
  const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`.trim()

  return (
    <View style={{ flexGrow: 1, padding: pt(spacing.pagePadding) }}>
      <View style={{ borderBottomWidth: pt(2), borderBottomColor: theme.primaryColor, paddingBottom: pt(10) }}>
        <Text style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: em(1.7, theme.fontScale), color: theme.textColor }}>
          {fullName || 'Tu nombre'}
        </Text>
        <Text
          style={{ fontFamily: fonts.body, fontSize: em(0.95, theme.fontScale), color: withAlpha(theme.textColor, 0.7), marginTop: pt(2) }}
        >
          {cv.personal.title || 'Tu puesto profesional'}
        </Text>
        <ContactInfoPdf personal={cv.personal} fontFamily={fonts.body} fontScale={theme.fontScale} layout="inline" color={theme.textColor} />
      </View>

      <View style={{ marginTop: pt(14) }}>
        {sections.map((id) => {
          const Block = SECTION_BLOCKS_PDF[id]
          return <Block key={id} cv={cv} theme={theme} spacing={spacing} tone="page" fonts={fonts} textColor={theme.textColor} />
        })}
      </View>
    </View>
  )
}
