import { Text, View } from '@react-pdf/renderer'
import type { CvTheme } from '@/types/cv'
import type { Spacing } from '@/lib/themeRuntime'
import { pt } from '@/pdf/units'

interface DescriptionTextPdfProps {
  text: string
  theme: CvTheme
  spacing: Spacing
  fontFamily: string
  fontSize: number
  color: string
  marginTop: number
}

/** Mirrors blocks.tsx's DescriptionText for the PDF: a plain paragraph, or one bullet
 * per non-empty line when the theme is set to 'bullets' — real Text nodes either way. */
export function DescriptionTextPdf({ text, theme, spacing, fontFamily, fontSize, color, marginTop }: DescriptionTextPdfProps) {
  if (!text) return null

  if (theme.descriptionStyle !== 'bullets') {
    return (
      <Text style={{ fontFamily, fontSize, color, marginTop, lineHeight: spacing.lineHeight }}>{text}</Text>
    )
  }

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length === 0) return null

  return (
    // Mirrors the HTML bullet list's `space-y-0.5` (2px between items) and each item's
    // `flex gap-1.5` (6px between the bullet glyph and its text).
    <View style={{ marginTop }}>
      {lines.map((line, i) => (
        <View key={i} style={{ flexDirection: 'row', marginTop: i === 0 ? 0 : pt(2) }}>
          <Text style={{ fontFamily, fontSize, color, marginRight: pt(6) }}>•</Text>
          <Text style={{ fontFamily, fontSize, color, flex: 1, lineHeight: spacing.lineHeight }}>{line}</Text>
        </View>
      ))}
    </View>
  )
}
