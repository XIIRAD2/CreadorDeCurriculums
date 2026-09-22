import { useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

interface ColorPickerPopoverProps {
  color: string
  onChange: (hex: string) => void
  label: string
}

export function ColorPickerPopover({ color, onChange, label }: ColorPickerPopoverProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:border-slate-400"
      >
        <span className="h-4 w-4 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: color }} />
        {color.toUpperCase()}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
          <HexColorPicker color={color} onChange={onChange} />
          <input
            value={color}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            className="mt-2 w-full rounded-md border border-slate-200 px-2 py-1 text-center text-xs uppercase outline-none focus:border-indigo-400"
          />
        </div>
      )}
    </div>
  )
}
