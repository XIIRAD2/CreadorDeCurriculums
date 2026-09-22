import { View, Text, Image } from '@react-pdf/renderer'
import type { PersonalInfo } from '@/types/cv'
import { withAlpha } from '@/lib/color'

interface CornerPhotoPdfProps {
  personal: PersonalInfo
  width: number | string
  height: number
  fontFamily: string
  textColor: string
}

/** Mirrors preview/CornerPhoto.tsx — no border, no radius, sized/positioned by the
 * caller to fill a page corner edge to edge. */
export function CornerPhotoPdf({ personal, width, height, fontFamily, textColor }: CornerPhotoPdfProps) {
  const initials = `${personal.firstName[0] ?? ''}${personal.lastName[0] ?? ''}`.toUpperCase()

  if (personal.photo) {
    return <Image src={personal.photo} style={{ width, height, objectFit: 'cover' }} />
  }

  return (
    <View style={{ width, height, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
      {initials && (
        <Text style={{ fontFamily, fontWeight: 600, fontSize: height * 0.4, color: withAlpha(textColor, 0.6) }}>{initials}</Text>
      )}
    </View>
  )
}
