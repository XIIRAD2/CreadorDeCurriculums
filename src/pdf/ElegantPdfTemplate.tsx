import { View, Text } from '@react-pdf/renderer'
import type { CvDocument } from '@/types/cv'
import { getSpacing } from '@/lib/themeRuntime'
import { withAlpha } from '@/lib/color'
import { sectionHasContent } from '@/lib/sections'
import { getPdfFontFamilies } from '@/pdf/fonts'
import { pt, em } from '@/pdf/units'
import { AvatarPdf } from '@/pdf/AvatarPdf'
import { ContactInfoPdf } from '@/pdf/ContactInfoPdf'
import { SECTION_BLOCKS_PDF } from '@/pdf/sectionBlocksPdf'

/** Mirrors templates/ElegantTemplate.tsx value-for-value. */
export function ElegantPdfTemplate({ cv }: { cv: CvDocument }) {
  const { theme } = cv
  const spacing = getSpacing(theme.density)
  const fonts = getPdfFontFamilies(theme.fontPairingId)
  const sections = cv.sectionOrder.filter((id) => !cv.hiddenSections.includes(id) && sectionHasContent(cv, id))
  const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`.trim()

  return (
    <View style={{ flexGrow: 1, alignItems: 'center', padding: pt(spacing.pagePadding) }}>
      {theme.showPhoto && (
        <View style={{ marginBottom: pt(16) }}>
          <AvatarPdf
            personal={cv.personal}
            shape={theme.photoShape}
            size={pt(100 * (theme.photoZoom ?? 1))}
            fontFamily={fonts.body}
            textColor={theme.textColor}
          />
        </View>
      )}
      <Text
        style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: em(2, theme.fontScale), color: theme.textColor, textAlign: 'center' }}
      >
        {fullName || 'Tu nombre'}
      </Text>
      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: em(0.95, theme.fontScale),
          color: withAlpha(theme.textColor, 0.7),
          textAlign: 'center',
          marginTop: pt(4),
        }}
      >
        {cv.personal.title || 'Tu puesto profesional'}
      </Text>
      <View style={{ width: pt(64), height: pt(3), borderRadius: pt(1.5), backgroundColor: theme.primaryColor, marginTop: pt(12), marginBottom: pt(12) }} />
      <View style={{ marginBottom: pt(24) }}>
        <ContactInfoPdf personal={cv.personal} fontFamily={fonts.body} fontScale={theme.fontScale} layout="inline" color={theme.textColor} />
      </View>

      <View style={{ width: '100%' }}>
        {sections.map((id) => {
          const Block = SECTION_BLOCKS_PDF[id]
          return <Block key={id} cv={cv} theme={theme} spacing={spacing} tone="page" fonts={fonts} textColor={theme.textColor} />
        })}
      </View>
    </View>
  )
}
