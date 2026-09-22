import type { ReactNode } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

interface SortableListProps<T extends { id: string }> {
  items: T[]
  onReorder: (ids: string[]) => void
  renderItem: (item: T, index: number) => ReactNode
  className?: string
}

/** Generic drag-to-reorder list: adds a grip handle to every row and reports the new
 * order of ids. Used for skills, languages, education/experience entries, projects,
 * certifications, links, and the CV section order itself. */
export function SortableList<T extends { id: string }>({ items, onReorder, renderItem, className }: SortableListProps<T>) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onReorder(arrayMove(items, oldIndex, newIndex).map((i) => i.id))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item, index) => (
            <SortableRow key={item.id} id={item.id}>
              {renderItem(item, index)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

function SortableRow({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="group/sortable relative flex items-start gap-1">
      <button
        type="button"
        aria-label="Reordenar"
        className="mt-2 flex h-6 w-5 shrink-0 cursor-grab items-center justify-center rounded text-slate-300 opacity-0 transition hover:text-slate-500 active:cursor-grabbing group-hover/sortable:opacity-100"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={15} />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
