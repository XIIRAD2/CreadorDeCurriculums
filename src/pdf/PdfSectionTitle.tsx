import { View, Text } from '@react-pdf/renderer'
import type { CvTheme, SectionId } from '@/types/cv'
import { pt } from '@/pdf/units'
import { SECTION_ICONS_PDF } from '@/pdf/sectionIconsPdf'

export function PdfSectionTitle({
  theme,
  tone,
  fontFamily,
  sectionId,
  color,
  children,
}: {
  theme: CvTheme
  tone: 'sidebar' | 'page'
  fontFamily: string
  sectionId: SectionId
  color: string
  children: string
}) {
  const borderColor = tone === 'sidebar' ? 'rgba(255,255,255,0.35)' : theme.accentColor
  const Icon = SECTION_ICONS_PDF[sectionId]
  return (
    // Mirrors blocks.tsx's <h3 className="mb-2 flex items-center gap-1.5 border-b-2 pb-1
    // text-[11px] …">: 11px is a flat Tailwind size, not `em`, so — unlike every other
    // text role — it does NOT scale with the font-size slider.
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: pt(2),
        borderBottomColor: borderColor,
        paddingBottom: pt(4),
        marginBottom: pt(8),
      }}
    >
      <View style={{ marginRight: pt(6) }}>
        <Icon size={pt(12.5)} color={color} strokeWidth={2.4} />
      </View>
      {/* Deliberately no letterSpacing here (HTML has `tracking-widest`): at this small a
          font size it pushes the glyph gaps wide enough that copying the text out of the
          PDF inserts a stray space between every letter — worse than losing the tracking. */}
      <Text
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: pt(11),
          textTransform: 'uppercase',
          color,
        }}
      >
        {children}
      </Text>
    </View>
  )
}
