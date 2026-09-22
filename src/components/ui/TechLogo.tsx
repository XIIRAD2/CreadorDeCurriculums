import { getTechLogo } from '@/lib/techLogos'

/** Renders a technology's brand logo inline if the name is recognized (see
 * lib/techLogos.ts) — renders nothing otherwise, so callers can drop this in without an
 * extra conditional for custom/unrecognized skill names. */
export function TechLogo({ name, size = 14, className }: { name: string; size?: number; className?: string }) {
  const logo = getTechLogo(name)
  if (!logo) return null

  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={`#${logo.hex}`} aria-hidden="true" className={`shrink-0 ${className ?? ''}`}>
      <path d={logo.path} />
    </svg>
  )
}
