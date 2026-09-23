import { View, Text } from '@react-pdf/renderer'
import type { CvDocument } from '@/types/cv'
import { getSpacing } from '@/lib/themeRuntime'
import { getContrastText, withAlpha } from '@/lib/color'
import { sectionHasContent } from '@/lib/sections'
import { getEffectiveColumns } from '@/lib/columns'
import { getPdfFontFamilies } from '@/pdf/fonts'
import { pt, em } from '@/pdf/units'
import { AvatarPdf } from '@/pdf/AvatarPdf'
import { CornerPhotoPdf } from '@/pdf/CornerPhotoPdf'
import { ContactInfoPdf } from '@/pdf/ContactInfoPdf'
import { SECTION_BLOCKS_PDF } from '@/pdf/sectionBlocksPdf'

/** Mirrors templates/CustomTemplate.tsx value-for-value. */
export function CustomPdfTemplate({ cv }: { cv: CvDocument }) {
  const { theme } = cv
  const spacing = getSpacing(theme.density)
  const fonts = getPdfFontFamilies(theme.fontPairingId)
  const headerText = getContrastText(theme.primaryColor)
  const columns = getEffectiveColumns(cv)
  const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`.trim()
  const headerPad = pt(spacing.pagePadding * 0.7)

  return (
    <View style={{ flexGrow: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.primaryColor,
          padding: headerPad,
        }}
      >
        {theme.showPhoto &&
          (theme.photoShape === 'corner' ? (
            <View style={{ marginTop: -headerPad, marginLeft: -headerPad, marginRight: pt(20) }}>
              <CornerPhotoPdf
                personal={cv.personal}
                width={pt(110 * (theme.photoZoom ?? 1))}
                height={pt(110 * (theme.photoZoom ?? 1))}
                fontFamily={fonts.body}
                textColor={headerText}
              />
            </View>
          ) : (
            <View style={{ marginRight: pt(20) }}>
              <AvatarPdf
                personal={cv.personal}
                shape={theme.photoShape}
                size={pt(92 * (theme.photoZoom ?? 1))}
                fontFamily={fonts.body}
                textColor={headerText}
              />
            </View>
          ))}
        <View style={{ flex: 1 }}>
          {fullName && (
            <Text style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: em(1.6, theme.fontScale), color: headerText }}>
              {fullName}
            </Text>
          )}
          {cv.personal.title && (
            <Text
              style={{ fontFamily: fonts.body, fontSize: em(0.95, theme.fontScale), color: withAlpha(headerText, 0.85), marginTop: pt(2) }}
            >
              {cv.personal.title}
            </Text>
          )}
          <ContactInfoPdf personal={cv.personal} fontFamily={fonts.body} fontScale={theme.fontScale} layout="inline" color={headerText} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', flexGrow: 1 }}>
        {columns.map((col, i) => {
          const sectionIds = col.sectionIds.filter((id) => sectionHasContent(cv, id))
          return (
            <View
              key={col.id}
              style={{
                width: `${col.widthPercent}%`,
                padding: pt(spacing.pagePadding * 0.85),
                ...(i > 0 ? { borderLeftWidth: pt(1), borderLeftColor: 'rgba(0,0,0,0.1)' } : {}),
              }}
            >
              {sectionIds.map((id) => {
                const Block = SECTION_BLOCKS_PDF[id]
                return <Block key={id} cv={cv} theme={theme} spacing={spacing} tone="page" fonts={fonts} textColor={theme.textColor} />
              })}
            </View>
          )
        })}
      </View>
    </View>
  )
}
