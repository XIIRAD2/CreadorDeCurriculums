import { useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { ChevronDown, FileText, Plus, Copy, Pencil, Trash2, Sparkles } from 'lucide-react'
import { db } from '@/db/db'
import { useCvStore } from '@/store/useCvStore'
import { formatRelativeTime } from '@/lib/time'
import { SAMPLE_CV_DATA } from '@/lib/sampleCv'
import { Modal } from '@/components/ui/Modal'
import { Button, IconButton } from '@/components/ui/Button'
import { TextField } from '@/components/ui/Field'

type DialogState =
  | { type: 'create' }
  | { type: 'duplicate'; id: string }
  | { type: 'rename'; id: string }
  | { type: 'delete'; id: string; name: string }
  | null

export function CvSwitcher() {
  const cvs = useLiveQuery(() => db.cvs.orderBy('updatedAt').reverse().toArray(), [], [])
  const activeId = useCvStore((s) => s.draft?.id)
  const activeName = useCvStore((s) => s.draft?.name)
  const activeCompany = useCvStore((s) => s.draft?.targetCompany)
  const loadCv = useCvStore((s) => s.loadCv)
  const createCv = useCvStore((s) => s.createCv)
  const duplicateCv = useCvStore((s) => s.duplicateCv)
  const deleteCv = useCvStore((s) => s.deleteCv)
  const renameCv = useCvStore((s) => s.renameCv)
  const applyImport = useCvStore((s) => s.applyImport)
  const saveNow = useCvStore((s) => s.saveNow)

  const [open, setOpen] = useState(false)
  const [dialog, setDialog] = useState<DialogState>(null)
  const [inputValue, setInputValue] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function openDialog(next: DialogState, initial = '') {
    setDialog(next)
    setInputValue(initial)
    setOpen(false)
  }

  async function confirmDialog() {
    if (!dialog) return
    const name = inputValue.trim()
    if (dialog.type === 'create') {
      await createCv(name || 'Nuevo currículum')
    } else if (dialog.type === 'duplicate') {
      if (!name) return
      await duplicateCv(dialog.id, name)
    } else if (dialog.type === 'rename') {
      if (!name) return
      if (dialog.id === activeId) renameCv(name)
      else await db.cvs.update(dialog.id, { name, updatedAt: Date.now() })
    } else if (dialog.type === 'delete') {
      if (dialog.id === activeId) await deleteCv(dialog.id)
      else await db.cvs.delete(dialog.id)
    }
    setDialog(null)
    setInputValue('')
  }

  const dialogTitle =
    dialog?.type === 'create' ? 'Nuevo currículum' : dialog?.type === 'duplicate' ? 'Duplicar currículum' : 'Renombrar currículum'

  async function loadSampleCv() {
    await createCv('CV de ejemplo')
    applyImport(SAMPLE_CV_DATA)
    await saveNow()
    setOpen(false)
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:border-slate-300"
      >
        <FileText size={15} className="shrink-0 text-indigo-500" />
        <span className="max-w-[200px] truncate font-medium text-slate-700">{activeName ?? 'Cargando…'}</span>
        {activeCompany && <span className="hidden max-w-[140px] truncate text-xs text-slate-400 sm:inline">· {activeCompany}</span>}
        <ChevronDown size={14} className="shrink-0 text-slate-400" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          <div className="thin-scrollbar max-h-72 space-y-0.5 overflow-y-auto">
            {(cvs ?? []).map((cv) => (
              <div
                key={cv.id}
                className={`group flex items-center gap-1 rounded-lg px-1.5 py-1 ${cv.id === activeId ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    void loadCv(cv.id)
                    setOpen(false)
                  }}
                  className="min-w-0 flex-1 rounded-md px-1.5 py-1 text-left"
                >
                  <div className="truncate text-sm font-medium text-slate-700">{cv.name}</div>
                  <div className="truncate text-[11px] text-slate-400">
                    {cv.targetCompany ? `${cv.targetCompany} · ` : ''}
                    {formatRelativeTime(cv.updatedAt)}
                  </div>
                </button>
                <div className="flex shrink-0 opacity-0 transition group-hover:opacity-100">
                  <IconButton label="Duplicar" onClick={() => openDialog({ type: 'duplicate', id: cv.id }, `${cv.name} (copia)`)}>
                    <Copy size={13} />
                  </IconButton>
                  <IconButton label="Renombrar" onClick={() => openDialog({ type: 'rename', id: cv.id }, cv.name)}>
                    <Pencil size={13} />
                  </IconButton>
                  <IconButton
                    variant="danger"
                    label="Eliminar"
                    disabled={(cvs?.length ?? 0) <= 1}
                    onClick={() => openDialog({ type: 'delete', id: cv.id, name: cv.name })}
                  >
                    <Trash2 size={13} />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <Button
              variant="outline"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => openDialog({ type: 'create' })}
              className="border-dashed"
            >
              Nuevo
            </Button>
            <Button variant="outline" size="sm" icon={<Sparkles size={14} />} onClick={() => void loadSampleCv()} className="border-dashed">
              CV de ejemplo
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={dialog !== null && dialog.type !== 'delete'}
        onClose={() => setDialog(null)}
        title={dialogTitle}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDialog(null)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={() => void confirmDialog()}>
              Guardar
            </Button>
          </>
        }
      >
        <TextField
          label="Nombre"
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="CV - Backend - Acme Corp"
          onKeyDown={(e) => {
            if (e.key === 'Enter') void confirmDialog()
          }}
        />
        {dialog?.type === 'duplicate' && (
          <p className="mt-2 text-xs text-slate-400">Se creará una copia independiente que podrás adaptar a esta oferta.</p>
        )}
      </Modal>

      <Modal
        open={dialog?.type === 'delete'}
        onClose={() => setDialog(null)}
        title="Eliminar currículum"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDialog(null)}>
              Cancelar
            </Button>
            <Button variant="danger" size="sm" onClick={() => void confirmDialog()}>
              Eliminar
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Se eliminará <strong>{dialog?.type === 'delete' ? dialog.name : ''}</strong> de forma permanente. Esta acción no se puede
          deshacer.
        </p>
      </Modal>
    </div>
  )
}
