import { Text, View } from '@react-pdf/renderer'
import type { PersonalInfo } from '@/types/cv'
import { withAlpha } from '@/lib/color'
import { pt, em } from '@/pdf/units'

interface ContactInfoPdfProps {
  personal: PersonalInfo
  fontFamily: string
  fontScale: number
  layout: 'stacked' | 'inline'
  /** The tone's plain text color (sidebarText/headerText) — the 90% opacity ContactInfo
   * applies to filled values is blended in here, not by the caller. */
  color: string
}

/** Only real, filled-in contact details ever reach the PDF — unlike the editor's live
 * preview, there is no "correo@ejemplo.com" placeholder to accidentally export.
 * Mirrors ContactInfo.tsx's `text-[0.85em] opacity-90`; the block's own margin (mb-5 in
 * the HTML templates) is applied by the caller, not in here — same as the HTML component. */
export function ContactInfoPdf({ personal, fontFamily, fontScale, layout, color }: ContactInfoPdfProps) {
  const fields = [personal.email, personal.phone, personal.location].filter(Boolean)
  if (fields.length === 0) return null
  const fontSize = em(0.85, fontScale)
  const textColor = withAlpha(color, 0.9)

  if (layout === 'inline') {
    // Mirrors the "inline" ContactInfo, wrapped in `mt-2.5` by MinimalTemplate.
    return <Text style={{ fontFamily, fontSize, marginTop: pt(10), color: textColor }}>{fields.join('   ·   ')}</Text>
  }

  // Mirrors the "stacked" ContactInfo's `space-y-1.5` (6px) gap between lines.
  return (
    <View>
      {fields.map((field, i) => (
        <Text key={i} style={{ fontFamily, fontSize, marginTop: i === 0 ? 0 : pt(6), color: textColor }}>
          {field}
        </Text>
      ))}
    </View>
  )
}
