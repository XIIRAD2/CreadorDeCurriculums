import type { ReactNode } from 'react'
import { Trash2 } from 'lucide-react'
import { IconButton } from '@/components/ui/Button'

interface EntryCardProps {
  onRemove: () => void
  removeLabel?: string
  children: ReactNode
}

/** Consistent card shell for repeating configurator entries (a skill, a job, a degree…):
 * padded box with a trash button tucked in the corner. */
export function EntryCard({ onRemove, removeLabel = 'Eliminar', children }: EntryCardProps) {
  return (
    <div className="relative rounded-xl border border-slate-200 bg-slate-50/70 p-3 pr-10">
      <IconButton variant="danger" label={removeLabel} onClick={onRemove} className="absolute right-1.5 top-1.5">
        <Trash2 size={14} />
      </IconButton>
      <div className="space-y-2">{children}</div>
    </div>
  )
}
