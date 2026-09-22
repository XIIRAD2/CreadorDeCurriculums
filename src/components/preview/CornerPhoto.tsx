import { User } from 'lucide-react'
import type { PersonalInfo } from '@/types/cv'

interface CornerPhotoProps {
  personal: PersonalInfo
  width: number | string
  height: number
}

/** The "esquina" photo shape: no border, no radius, no padding around it — it's meant
 * to fill the corner of the page edge to edge, not sit inside the header like a small
 * framed avatar (see AvatarPlaceholder.tsx for that). Callers position/size this
 * themselves; this only renders the image (or its fallback) to fill whatever box it's
 * given. */
export function CornerPhoto({ personal, width, height }: CornerPhotoProps) {
  const initials = `${personal.firstName[0] ?? ''}${personal.lastName[0] ?? ''}`.toUpperCase()

  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden"
      style={{ width, height, backgroundColor: 'rgba(255,255,255,0.15)' }}
    >
      {personal.photo ? (
        <img src={personal.photo} alt="" className="h-full w-full object-cover" />
      ) : initials ? (
        <span style={{ fontSize: height * 0.4 }} className="font-semibold opacity-60">
          {initials}
        </span>
      ) : (
        <User size={height * 0.45} className="opacity-50" />
      )}
    </div>
  )
}
