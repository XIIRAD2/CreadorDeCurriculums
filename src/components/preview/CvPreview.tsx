import { useEffect, type ComponentType } from 'react'
import type { CvDocument, TemplateId } from '@/types/cv'
import { SidebarTemplate } from '@/components/preview/templates/SidebarTemplate'
import { MinimalTemplate } from '@/components/preview/templates/MinimalTemplate'
import { TwoColumnTemplate } from '@/components/preview/templates/TwoColumnTemplate'
import { ElegantTemplate } from '@/components/preview/templates/ElegantTemplate'
import { CompactAtsTemplate } from '@/components/preview/templates/CompactAtsTemplate'
import { usePagination } from '@/components/preview/usePagination'
import { PAGE_WIDTH_PX, PAGE_HEIGHT_PX } from '@/components/preview/pageSize'

const TEMPLATE_COMPONENTS: Record<TemplateId, ComponentType<{ cv: CvDocument }>> = {
  sidebar: SidebarTemplate,
  minimal: MinimalTemplate,
  'two-column': TwoColumnTemplate,
  elegant: ElegantTemplate,
  'compact-ats': CompactAtsTemplate,
}

interface CvPreviewProps {
  cv: CvDocument
  onPageCountChange?: (count: number) => void
}

/** Renders the CV as one or more real A4 page boxes side by side (with horizontal
 * scroll for the overflow) instead of a single ever-growing div — see
 * `usePagination.ts` for how the safe page-break points are found.
 *
 * The single-page case (by far the most common) renders the template directly, exactly
 * as before pagination existed — nothing about that path changed, so short CVs still get
 * the template's own `flex-1`/`h-full` stretch-to-fill-the-page behavior untouched.
 *
 * For 2+ pages, each page is the *same* full, unclipped template render, wrapped in a
 * `height`-clamped window shifted up by that page's starting offset — so page 2 just
 * shows the slice of the (identical) full content that didn't fit on page 1, page 3 the
 * next slice, and so on. Nothing is re-measured per page; only the shared hidden
 * `measureRef` copy is ever inspected. */
export function CvPreview({ cv, onPageCountChange }: CvPreviewProps) {
  const { measureRef, breakpoints, pageCount, totalHeight } = usePagination()

  useEffect(() => {
    onPageCountChange?.(pageCount)
  }, [pageCount, onPageCountChange])

  const Template = TEMPLATE_COMPONENTS[cv.theme.templateId] ?? SidebarTemplate
  const bounds = [0, ...breakpoints, totalHeight]

  return (
    <div className="relative">
      {/* Always-mounted, invisible full render used only to measure where entries/headers
          land — same width as the real page(s) so wrapping matches exactly. Positioned to
          overlap the visible content (not offset off-screen) so it can't inflate the
          preview panel's scrollable area. */}
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{ position: 'absolute', top: 0, left: 0, width: PAGE_WIDTH_PX, visibility: 'hidden', pointerEvents: 'none' }}
      >
        <Template cv={cv} />
      </div>

      {pageCount <= 1 ? (
        <div className="cv-page shadow-2xl shadow-slate-400/30" style={{ overflow: 'hidden' }}>
          <Template cv={cv} />
        </div>
      ) : (
        <div className="flex flex-row items-start gap-6">
          {bounds.slice(0, -1).map((pageTop, i) => {
            const pageHeight = bounds[i + 1] - pageTop
            return (
              <div
                key={i}
                className="cv-page shrink-0 shadow-2xl shadow-slate-400/30"
                style={{ height: PAGE_HEIGHT_PX, overflow: 'hidden' }}
              >
                <div style={{ height: pageHeight, overflow: 'hidden' }}>
                  <div style={{ transform: `translateY(-${pageTop}px)` }}>
                    <Template cv={cv} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
