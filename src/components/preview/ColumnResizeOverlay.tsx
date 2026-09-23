import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useCvStore } from '@/store/useCvStore'
import { getEffectiveColumns } from '@/lib/columns'
import { PAGE_WIDTH_PX, PAGE_HEIGHT_PX } from '@/components/preview/pageSize'
import type { CvDocument } from '@/types/cv'

const MIN_WIDTH_PERCENT = 15

/** Drag handles between adjacent columns, laid over page 1 (`CvPreview.tsx` renders this
 * only once even on a multi-page CV — every page shows the same columns, so one set of
 * handles is enough). Computed purely from `getEffectiveColumns`'s widths converted to
 * pixels — it never reaches into the template's own DOM, so the same overlay works for
 * every column-based template (Barra lateral, Dos columnas, Personalizada) without any
 * of them knowing it's there. */
export function ColumnResizeOverlay({ cv }: { cv: CvDocument }) {
  const updateColumns = useCvStore((s) => s.updateColumns)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const startRef = useRef<{ x: number; leftWidth: number; rightWidth: number } | null>(null)

  const columns = getEffectiveColumns(cv, { includeHidden: true })
  if (columns.length < 2) return null

  function handlePointerDown(index: number, e: ReactPointerEvent<HTMLDivElement>) {
    e.preventDefault()
    startRef.current = { x: e.clientX, leftWidth: columns[index].widthPercent, rightWidth: columns[index + 1].widthPercent }
    setDragIndex(index)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(index: number, e: ReactPointerEvent<HTMLDivElement>) {
    if (dragIndex !== index || !startRef.current) return
    const deltaPercent = ((e.clientX - startRef.current.x) / PAGE_WIDTH_PX) * 100
    let left = startRef.current.leftWidth + deltaPercent
    let right = startRef.current.rightWidth - deltaPercent
    if (left < MIN_WIDTH_PERCENT) {
      right -= MIN_WIDTH_PERCENT - left
      left = MIN_WIDTH_PERCENT
    }
    if (right < MIN_WIDTH_PERCENT) {
      left -= MIN_WIDTH_PERCENT - right
      right = MIN_WIDTH_PERCENT
    }
    updateColumns(
      columns.map((c, i) => {
        if (i === index) return { ...c, widthPercent: left }
        if (i === index + 1) return { ...c, widthPercent: right }
        return c
      }),
    )
  }

  function handlePointerUp() {
    setDragIndex(null)
    startRef.current = null
  }

  let cumulative = 0
  const boundaries: number[] = []
  for (let i = 0; i < columns.length - 1; i++) {
    cumulative += columns[i].widthPercent
    boundaries.push(cumulative)
  }

  return (
    <>
      {boundaries.map((percent, i) => (
        <div
          key={i}
          onPointerDown={(e) => handlePointerDown(i, e)}
          onPointerMove={(e) => handlePointerMove(i, e)}
          onPointerUp={handlePointerUp}
          className="group absolute top-0 z-10 flex w-3 -translate-x-1/2 cursor-col-resize items-center justify-center"
          style={{ left: `${percent}%`, height: PAGE_HEIGHT_PX }}
          title="Arrastra para cambiar el ancho de las columnas"
        >
          <div className="h-full w-[3px] rounded-full bg-transparent transition group-hover:bg-indigo-400/70" />
        </div>
      ))}
    </>
  )
}
