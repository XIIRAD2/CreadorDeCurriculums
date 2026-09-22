import { Svg, Path } from '@react-pdf/renderer'
import { getTechLogo } from '@/lib/techLogos'

/** Mirrors components/ui/TechLogo.tsx — renders nothing for an unrecognized name. */
export function TechLogoPdf({ name, size = 10 }: { name: string; size?: number }) {
  const logo = getTechLogo(name)
  if (!logo) return null

  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size }}>
      <Path d={logo.path} fill={`#${logo.hex}`} />
    </Svg>
  )
}
