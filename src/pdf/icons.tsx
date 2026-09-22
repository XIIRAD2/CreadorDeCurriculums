import { Svg, Path, Circle, Rect, Line } from '@react-pdf/renderer'

export interface PdfIconProps {
  size: number
  color: string
  strokeWidth?: number
}

/** Same path data lucide-react ships for these icons (node_modules/lucide-react/dist/esm/
 * icons/*.mjs), redrawn with react-pdf's Svg primitives — so the PDF's section headings
 * carry the same little icons as the live preview instead of plain bold text. */
function strokeProps(color: string, strokeWidth: number) {
  return { stroke: color, strokeWidth, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
}

function UserIcon({ size, color, strokeWidth = 2.4 }: PdfIconProps) {
  const p = strokeProps(color, strokeWidth)
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" {...p} />
      <Circle cx={12} cy={7} r={4} {...p} />
    </Svg>
  )
}

function BriefcaseIcon({ size, color, strokeWidth = 2.4 }: PdfIconProps) {
  const p = strokeProps(color, strokeWidth)
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" {...p} />
      <Rect width={20} height={14} x={2} y={6} rx={2} {...p} />
    </Svg>
  )
}

function GraduationCapIcon({ size, color, strokeWidth = 2.4 }: PdfIconProps) {
  const p = strokeProps(color, strokeWidth)
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"
        {...p}
      />
      <Path d="M22 10v6" {...p} />
      <Path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" {...p} />
    </Svg>
  )
}

function SparklesIcon({ size, color, strokeWidth = 2.4 }: PdfIconProps) {
  const p = strokeProps(color, strokeWidth)
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
        {...p}
      />
      <Path d="M20 2v4" {...p} />
      <Path d="M22 4h-4" {...p} />
      <Circle cx={4} cy={20} r={2} {...p} />
    </Svg>
  )
}

function GlobeIcon({ size, color, strokeWidth = 2.4 }: PdfIconProps) {
  const p = strokeProps(color, strokeWidth)
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={10} {...p} />
      <Path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" {...p} />
      <Path d="M2 12h20" {...p} />
    </Svg>
  )
}

function FolderIcon({ size, color, strokeWidth = 2.4 }: PdfIconProps) {
  const p = strokeProps(color, strokeWidth)
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
        {...p}
      />
    </Svg>
  )
}

function AwardIcon({ size, color, strokeWidth = 2.4 }: PdfIconProps) {
  const p = strokeProps(color, strokeWidth)
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"
        {...p}
      />
      <Circle cx={12} cy={8} r={6} {...p} />
    </Svg>
  )
}

function LinkIcon({ size, color, strokeWidth = 2.4 }: PdfIconProps) {
  const p = strokeProps(color, strokeWidth)
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M9 17H7A5 5 0 0 1 7 7h2" {...p} />
      <Path d="M15 7h2a5 5 0 1 1 0 10h-2" {...p} />
      <Line x1={8} x2={16} y1={12} y2={12} {...p} />
    </Svg>
  )
}

export const ICON_COMPONENTS_PDF = {
  UserIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  SparklesIcon,
  GlobeIcon,
  FolderIcon,
  AwardIcon,
  LinkIcon,
}
