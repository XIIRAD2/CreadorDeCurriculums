import { Eye, EyeOff, Plus, Minus, GripVertical } from 'lucide-react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, useDroppable, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SECTION_LABELS } from '@/types/cv'
import type { CvDocument, SectionId, ColumnLayout } from '@/types/cv'
import { getEffectiveColumns } from '@/lib/columns'

interface ColumnSectionsProps {
  cv: CvDocument
  onColumnsChange: (columns: ColumnLayout[]) => void
  onToggleVisibility: (id: SectionId) => void
  onAddColumn: () => void
  onRemoveColumn: (id: string) => void
}

/** Multi-container drag & drop between columns — the standard dnd-kit "multiple
 * containers" pattern: one shared `DndContext`, one `SortableContext` per column, each
 * column also a `useDroppable` zone (for dropping into an empty column, or past its last
 * item). Used instead of the plain single-list `SortableList.tsx` whenever the active
 * template is column-based (see DesignForm.tsx). */
export function ColumnSections({ cv, onColumnsChange, onToggleVisibility, onAddColumn, onRemoveColumn }: ColumnSectionsProps) {
  const columns = getEffectiveColumns(cv, { includeHidden: true })
  const isCustom = cv.theme.templateId === 'custom'
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  function findColumnIndex(sectionId: string): number {
    return columns.findIndex((col) => col.sectionIds.includes(sectionId as SectionId))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const activeId = active.id as SectionId
    const fromIndex = findColumnIndex(activeId)
    if (fromIndex === -1) return

    const overId = over.id as string
    const isColumnDrop = overId.startsWith('col-')
    const toIndex = isColumnDrop ? columns.findIndex((c) => `col-${c.id}` === overId) : findColumnIndex(overId)
    if (toIndex === -1) return
    if (fromIndex === toIndex && !isColumnDrop && activeId === overId) return

    const next = columns.map((c) => ({ ...c, sectionIds: c.sectionIds.filter((id) => id !== activeId) }))
    const insertAt = isColumnDrop ? next[toIndex].sectionIds.length : next[toIndex].sectionIds.indexOf(overId as SectionId)
    next[toIndex].sectionIds.splice(insertAt === -1 ? next[toIndex].sectionIds.length : insertAt, 0, activeId)
    onColumnsChange(next)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="space-y-3">
        {columns.map((col, i) => (
          <ColumnGroup
            key={col.id}
            column={col}
            index={i}
            hiddenSections={cv.hiddenSections}
            onToggleVisibility={onToggleVisibility}
            canRemove={isCustom && columns.length > 1}
            onRemove={() => onRemoveColumn(col.id)}
          />
        ))}
      </div>
      {isCustom && (
        <button
          type="button"
          onClick={onAddColumn}
          disabled={columns.length >= 4}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-1.5 text-xs font-medium text-slate-500 transition hover:border-slate-400 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={13} /> Añadir columna
        </button>
      )}
    </DndContext>
  )
}

function ColumnGroup({
  column,
  index,
  hiddenSections,
  onToggleVisibility,
  canRemove,
  onRemove,
}: {
  column: ColumnLayout
  index: number
  hiddenSections: SectionId[]
  onToggleVisibility: (id: SectionId) => void
  canRemove: boolean
  onRemove: () => void
}) {
  const { setNodeRef } = useDroppable({ id: `col-${column.id}` })

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">
          Columna {index + 1} · {Math.round(column.widthPercent)}%
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Quitar columna"
            className="rounded p-0.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
          >
            <Minus size={13} />
          </button>
        )}
      </div>
      <SortableContext items={column.sectionIds} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="min-h-[36px] space-y-1.5">
          {column.sectionIds.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-200 px-2.5 py-3 text-center text-[11px] text-slate-400">
              Arrastra una sección aquí
            </div>
          )}
          {column.sectionIds.map((id) => (
            <SortableSectionRow key={id} id={id} hidden={hiddenSections.includes(id)} onToggle={() => onToggleVisibility(id)} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

function SortableSectionRow({ id, hidden, onToggle }: { id: SectionId; hidden: boolean; onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 }

  return (
    <div ref={setNodeRef} style={style} className="group/sortable relative flex items-center gap-1">
      <button
        type="button"
        aria-label="Reordenar"
        className="flex h-6 w-5 shrink-0 cursor-grab items-center justify-center rounded text-slate-300 opacity-0 transition hover:text-slate-500 active:cursor-grabbing group-hover/sortable:opacity-100"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </button>
      <div
        className={`flex flex-1 items-center justify-between rounded-lg border px-2.5 py-1.5 text-sm ${
          hidden ? 'border-slate-100 bg-slate-50 text-slate-400' : 'border-slate-200 text-slate-700'
        }`}
      >
        {SECTION_LABELS[id]}
        <button
          type="button"
          onClick={onToggle}
          aria-label={hidden ? 'Mostrar sección' : 'Ocultar sección'}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          {hidden ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  )
}
