import { useEffect, useRef, useState, type RefObject } from 'react'
import { computeBreakpoints, type ChunkRect } from '@/lib/paginate'
import { PAGE_HEIGHT_PX } from '@/components/preview/pageSize'

interface PaginationResult {
  /** Attach to the always-mounted, invisible full render used purely for measurement. */
  measureRef: RefObject<HTMLDivElement | null>
  breakpoints: number[]
  pageCount: number
  totalHeight: number
}

/** Measures every `[data-cv-chunk]` element inside the node `measureRef` is attached to
 * (a full, unclipped, invisible render of the current template) and derives safe page-break
 * Y-coordinates from their positions — re-measures automatically whenever that content's
 * size changes, via the same `ResizeObserver` pattern the old single-page height check used. */
export function usePagination(): PaginationResult {
  const measureRef = useRef<HTMLDivElement>(null)
  const [totalHeight, setTotalHeight] = useState(PAGE_HEIGHT_PX)
  const [breakpoints, setBreakpoints] = useState<number[]>([])

  useEffect(() => {
    const el = measureRef.current
    if (!el) return

    function measure() {
      if (!el) return
      const containerTop = el.getBoundingClientRect().top
      const nodes = el.querySelectorAll<HTMLElement>('[data-cv-chunk]')
      const chunks: ChunkRect[] = Array.from(nodes).map((node) => {
        const rect = node.getBoundingClientRect()
        return { top: rect.top - containerTop, bottom: rect.bottom - containerTop }
      })
      const height = el.getBoundingClientRect().height
      setTotalHeight(height)
      setBreakpoints(computeBreakpoints(chunks, height, PAGE_HEIGHT_PX))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { measureRef, breakpoints, pageCount: breakpoints.length + 1, totalHeight }
}
