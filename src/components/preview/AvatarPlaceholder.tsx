import { User } from 'lucide-react'
import type { PersonalInfo, PhotoShape } from '@/types/cv'

interface AvatarProps {
  personal: PersonalInfo
  shape: PhotoShape
  size: number
}

// 'corner' only gets its real "fills the page corner" treatment in the templates that
// implement it specially (see CornerPhoto.tsx); wherever this plain Avatar is used with
// that shape instead (e.g. Elegante's centered photo), it just falls back to a square.
const RADIUS: Record<PhotoShape, string> = {
  circle: '9999px',
  rounded: '14px',
  square: '0px',
  corner: '0px',
}

export function Avatar({ personal, shape, size }: AvatarProps) {
  const initials = `${personal.firstName[0] ?? ''}${personal.lastName[0] ?? ''}`.toUpperCase()

  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden border-4"
      style={{
        width: size,
        height: size,
        borderRadius: RADIUS[shape],
        borderColor: 'rgba(255,255,255,0.25)',
        backgroundColor: 'rgba(255,255,255,0.15)',
      }}
    >
      {personal.photo ? (
        <img src={personal.photo} alt="" className="h-full w-full object-cover" />
      ) : initials ? (
        <span style={{ fontSize: size * 0.36 }} className="font-semibold opacity-60">
          {initials}
        </span>
      ) : (
        <User size={size * 0.42} className="opacity-50" />
      )}
    </div>
  )
}
