import { useEffect, useState, type RefObject, type ComponentType } from 'react'
import type { CvDocument, TemplateId } from '@/types/cv'
import { SidebarTemplate } from '@/components/preview/templates/SidebarTemplate'
import { MinimalTemplate } from '@/components/preview/templates/MinimalTemplate'
import { TwoColumnTemplate } from '@/components/preview/templates/TwoColumnTemplate'
import { ElegantTemplate } from '@/components/preview/templates/ElegantTemplate'
import { CompactAtsTemplate } from '@/components/preview/templates/CompactAtsTemplate'

const A4_HEIGHT_PX = 1123

const TEMPLATE_COMPONENTS: Record<TemplateId, ComponentType<{ cv: CvDocument }>> = {
  sidebar: SidebarTemplate,
  minimal: MinimalTemplate,
  'two-column': TwoColumnTemplate,
  elegant: ElegantTemplate,
  'compact-ats': CompactAtsTemplate,
}

interface CvPreviewProps {
  cv: CvDocument
  pageRef: RefObject<HTMLDivElement | null>
  onPageCountChange?: (count: number) => void
}

export function CvPreview({ cv, pageRef, onPageCountChange }: CvPreviewProps) {
  const [contentHeight, setContentHeight] = useState(A4_HEIGHT_PX)

  useEffect(() => {
    const el = pageRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setContentHeight(entry.contentRect.height)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [pageRef])

  const pageCount = Math.max(1, Math.ceil(contentHeight / A4_HEIGHT_PX))

  useEffect(() => {
    onPageCountChange?.(pageCount)
  }, [pageCount, onPageCountChange])

  const Template = TEMPLATE_COMPONENTS[cv.theme.templateId] ?? SidebarTemplate

  return (
    <div ref={pageRef} className="cv-page relative shadow-2xl shadow-slate-400/30">
      <Template cv={cv} />
      {Array.from({ length: pageCount - 1 }).map((_, i) => (
        <div
          key={i}
          className="pointer-events-none absolute left-0 right-0 border-t-2 border-dashed border-rose-300"
          style={{ top: (i + 1) * A4_HEIGHT_PX }}
        >
          <span className="absolute right-2 top-1 rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium text-rose-500">
            Salto de página {i + 2}
          </span>
        </div>
      ))}
    </div>
  )
}
