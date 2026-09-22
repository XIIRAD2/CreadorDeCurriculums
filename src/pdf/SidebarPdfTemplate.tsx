import { View, Text } from '@react-pdf/renderer'
import type { CvDocument } from '@/types/cv'
import { getSpacing } from '@/lib/themeRuntime'
import { getContrastText, withAlpha } from '@/lib/color'
import { SIDEBAR_SECTIONS, MAIN_SECTIONS, sectionHasContent } from '@/lib/sections'
import { getPdfFontFamilies } from '@/pdf/fonts'
import { pt, em } from '@/pdf/units'
import { AvatarPdf } from '@/pdf/AvatarPdf'
import { CornerPhotoPdf } from '@/pdf/CornerPhotoPdf'
import { ContactInfoPdf } from '@/pdf/ContactInfoPdf'
import { SECTION_BLOCKS_PDF } from '@/pdf/sectionBlocksPdf'

/** Mirrors templates/SidebarTemplate.tsx value-for-value. */
export function SidebarPdfTemplate({ cv }: { cv: CvDocument }) {
  const { theme } = cv
  const spacing = getSpacing(theme.density)
  const fonts = getPdfFontFamilies(theme.fontPairingId)
  const sidebarText = getContrastText(theme.primaryColor)
  const asidePad = pt(spacing.pagePadding * 0.75)

  const sidebarSections = cv.sectionOrder.filter(
    (id) => SIDEBAR_SECTIONS.includes(id) && !cv.hiddenSections.includes(id) && sectionHasContent(cv, id),
  )
  const mainSections = cv.sectionOrder.filter(
    (id) => MAIN_SECTIONS.includes(id) && !cv.hiddenSections.includes(id) && sectionHasContent(cv, id),
  )
  const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`.trim()

  return (
    // Absolutely positioned + `fixed` (not a flex row) on purpose: a plain flex row
    // here stretches BOTH columns to match the taller one on every page react-pdf adds
    // while paginating — on a 2nd/3rd page, once the sidebar has no content left, that
    // stretch still paints its full-height colored background with nothing in it,
    // shoving the main column over ("stacks empty to the side" on the new page). Fixed
    // + absolute makes the sidebar its own independent, page-height-tall column that
    // repeats identically on every page, and the main column just reserves room for it
    // with marginLeft instead of sharing a flex row's height.
    <View style={{ flexGrow: 1, position: 'relative' }}>
      <View
        fixed
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '35%',
          backgroundColor: theme.primaryColor,
          padding: pt(spacing.pagePadding * 0.75),
        }}
      >
        {theme.showPhoto &&
          (theme.photoShape === 'corner' ? (
            // Negative margin bleeds past the sidebar View's own padding on three sides
            // to reach the page's real top-left corner — mirrors SidebarTemplate.tsx.
            <View style={{ marginTop: -asidePad, marginLeft: -asidePad, marginRight: -asidePad, marginBottom: pt(16) }}>
              <CornerPhotoPdf
                personal={cv.personal}
                width="100%"
                height={pt(170 * (theme.photoZoom ?? 1))}
                fontFamily={fonts.body}
                textColor={sidebarText}
              />
            </View>
          ) : (
            <View style={{ alignItems: 'center', marginBottom: pt(16) }}>
              <AvatarPdf
                personal={cv.personal}
                shape={theme.photoShape}
                size={pt(110 * (theme.photoZoom ?? 1))}
                fontFamily={fonts.body}
                textColor={sidebarText}
              />
            </View>
          ))}

        {(fullName || cv.personal.title) && (
          <View style={{ marginBottom: pt(20), alignItems: 'center' }}>
            {fullName && (
              <Text
                style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: em(1.45, theme.fontScale), color: sidebarText, textAlign: 'center' }}
              >
                {fullName}
              </Text>
            )}
            {cv.personal.title && (
              <Text
                style={{
                  fontFamily: fonts.body,
                  fontSize: em(0.9, theme.fontScale),
                  color: withAlpha(sidebarText, 0.85),
                  textAlign: 'center',
                  marginTop: pt(4),
                }}
              >
                {cv.personal.title}
              </Text>
            )}
          </View>
        )}

        <View style={{ marginBottom: pt(20) }}>
          <ContactInfoPdf personal={cv.personal} fontFamily={fonts.body} fontScale={theme.fontScale} layout="stacked" color={sidebarText} />
        </View>

        {sidebarSections.map((id) => {
          const Block = SECTION_BLOCKS_PDF[id]
          return <Block key={id} cv={cv} theme={theme} spacing={spacing} tone="sidebar" fonts={fonts} textColor={sidebarText} />
        })}
      </View>

      <View style={{ marginLeft: '35%', padding: pt(spacing.pagePadding) }}>
        {mainSections.map((id) => {
          const Block = SECTION_BLOCKS_PDF[id]
          return <Block key={id} cv={cv} theme={theme} spacing={spacing} tone="page" fonts={fonts} textColor={theme.textColor} />
        })}
      </View>
    </View>
  )
}
