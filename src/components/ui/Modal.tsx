import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'lg'
}

const MAX_WIDTH = {
  sm: 'max-w-sm',
  lg: 'max-w-2xl',
}

export function Modal({ open, onClose, title, children, footer, size = 'sm' }: ModalProps) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        className={`flex max-h-[90vh] w-full flex-col rounded-2xl bg-white p-5 shadow-2xl ${MAX_WIDTH[size]}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="shrink-0 text-base font-semibold text-slate-800">{title}</h2>
        <div className="mt-3 min-h-0 flex-1 overflow-y-auto thin-scrollbar">{children}</div>
        {footer && <div className="mt-4 flex shrink-0 justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}
