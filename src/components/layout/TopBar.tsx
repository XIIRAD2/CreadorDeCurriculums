import { useState, type ReactNode } from 'react'
import { FileText, Save, Wand2, Briefcase, Download, Sun, Moon } from 'lucide-react'
import { useCvStore } from '@/store/useCvStore'
import { useViewStore, type AppView } from '@/store/useViewStore'
import { useAppThemeStore } from '@/store/useAppThemeStore'
import { formatRelativeTime } from '@/lib/time'
import { cvToImportedShape, cvFileSlug } from '@/lib/cvExport'
import { CvSwitcher } from '@/components/cvManager/CvSwitcher'
import { ImportJsonModal } from '@/components/cvManager/ImportJsonModal'
import { Button, IconButton } from '@/components/ui/Button'
import { ExportJsonModal } from '@/components/ui/ExportJsonModal'

const STATUS_STYLES = {
  idle: { dot: 'bg-slate-300', label: 'Sin cambios' },
  saving: { dot: 'animate-pulse bg-amber-400', label: 'Guardando…' },
  saved: { dot: 'bg-emerald-500', label: 'Guardado' },
  error: { dot: 'bg-rose-500', label: 'Error al guardar' },
} as const

function SaveStatusBadge() {
  const status = useCvStore((s) => s.saveStatus)
  const lastSavedAt = useCvStore((s) => s.lastSavedAt)
  const style = STATUS_STYLES[status]
  const label = status === 'saved' && lastSavedAt ? `Guardado ${formatRelativeTime(lastSavedAt)}` : style.label

  return (
    <span className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {label}
    </span>
  )
}

const VIEW_TABS: { id: AppView; label: string; icon: ReactNode }[] = [
  { id: 'cv', label: 'Currículum', icon: <FileText size={14} /> },
  { id: 'tracker', label: 'Ofertas', icon: <Briefcase size={14} /> },
]

function ViewTabs() {
  const view = useViewStore((s) => s.view)
  const setView = useViewStore((s) => s.setView)

  return (
    <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
      {VIEW_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setView(tab.id)}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
            view === tab.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function ThemeToggle() {
  const mode = useAppThemeStore((s) => s.mode)
  const toggle = useAppThemeStore((s) => s.toggle)
  return (
    <IconButton label={mode === 'dark' ? 'Modo día' : 'Modo noche'} onClick={toggle}>
      {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </IconButton>
  )
}

export function TopBar() {
  const view = useViewStore((s) => s.view)
  const draft = useCvStore((s) => s.draft)
  const targetCompany = useCvStore((s) => s.draft?.targetCompany ?? '')
  const setTargetCompany = useCvStore((s) => s.setTargetCompany)
  const saveNow = useCvStore((s) => s.saveNow)
  const [importOpen, setImportOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)

  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <FileText size={16} />
        </div>
        <span className="hidden text-sm font-semibold text-slate-800 lg:inline">Creador de Currículums</span>
      </div>

      <ViewTabs />

      {view === 'cv' && (
        <>
          <CvSwitcher />

          <Button variant="outline" size="sm" icon={<Wand2 size={14} />} onClick={() => setImportOpen(true)}>
            Importar con IA
          </Button>

          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => setExportOpen(true)}>
            Exportar JSON
          </Button>

          <input
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            placeholder="Empresa a la que aplicas (opcional)"
            className="min-w-[160px] max-w-xs flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600 outline-none focus:border-indigo-400 focus:bg-white"
          />
        </>
      )}

      <div className="ml-auto flex items-center gap-3">
        {view === 'cv' && (
          <>
            <SaveStatusBadge />
            <Button variant="outline" size="sm" icon={<Save size={14} />} onClick={() => void saveNow()}>
              Guardar
            </Button>
          </>
        )}
        <ThemeToggle />
      </div>

      <ImportJsonModal open={importOpen} onClose={() => setImportOpen(false)} />
      {draft && (
        <ExportJsonModal
          open={exportOpen}
          onClose={() => setExportOpen(false)}
          title="Exportar CV en JSON"
          description="Copia este JSON para editarlo fuera de la app (a mano o con una IA) y pegarlo de vuelta en “Importar con IA” cuando quieras. Tiene el mismo formato que espera esa importación."
          data={cvToImportedShape(draft)}
          filename={`${cvFileSlug(draft.name)}.json`}
        />
      )}
    </header>
  )
}
