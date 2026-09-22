import { View, Text, Image } from '@react-pdf/renderer'
import type { PersonalInfo, PhotoShape } from '@/types/cv'
import { pt } from '@/pdf/units'
import { withAlpha } from '@/lib/color'

interface AvatarPdfProps {
  personal: PersonalInfo
  shape: PhotoShape
  size: number
  fontFamily: string
  /** The surrounding tone's text color (sidebarText/headerText) — the HTML version's
   * initials span has no color of its own, it inherits this at 60% opacity. */
  textColor: string
}

// Mirrors AvatarPlaceholder.tsx's RADIUS map exactly (circle: full round, rounded: a
// flat 14px regardless of avatar size, square/corner: none — 'corner' only gets its
// real "fills the page corner" treatment in templates that implement it specially, via
// CornerPhotoPdf; here it's just a square fallback).
function radiusFor(shape: PhotoShape, size: number): number {
  if (shape === 'circle') return size / 2
  if (shape === 'rounded') return pt(14)
  return 0
}

const BORDER_COLOR = 'rgba(255,255,255,0.25)'
const FALLBACK_BG = 'rgba(255,255,255,0.15)'

export function AvatarPdf({ personal, shape, size, fontFamily, textColor }: AvatarPdfProps) {
  const radius = radiusFor(shape, size)
  const initials = `${personal.firstName[0] ?? ''}${personal.lastName[0] ?? ''}`.toUpperCase()

  if (personal.photo) {
    return (
      <Image
        src={personal.photo}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          borderWidth: pt(4),
          borderColor: BORDER_COLOR,
          objectFit: 'cover',
        }}
      />
    )
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        borderWidth: pt(4),
        borderColor: BORDER_COLOR,
        backgroundColor: FALLBACK_BG,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {initials && (
        <Text style={{ fontFamily, fontWeight: 600, fontSize: size * 0.36, color: withAlpha(textColor, 0.6) }}>{initials}</Text>
      )}
    </View>
  )
}
