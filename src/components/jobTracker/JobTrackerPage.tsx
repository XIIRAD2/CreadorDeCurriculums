import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Wand2, Plus, Trash2, Briefcase, ArrowUp, ArrowDown, ArrowUpDown, UserCog } from 'lucide-react'
import { db } from '@/db/db'
import { addApplication, removeApplications } from '@/lib/jobTracker'
import { sortApplications, type JobSortKey, type JobSortState } from '@/lib/jobSort'
import { computeJobScore, scoreBand } from '@/lib/jobScore'
import { getAppSettings } from '@/lib/settings'
import { DEFAULT_APP_SETTINGS } from '@/types/settings'
import { ImportJobsModal } from '@/components/jobTracker/ImportJobsModal'
import { JobApplicationRow } from '@/components/jobTracker/JobApplicationRow'
import { SearchProfileModal } from '@/components/jobTracker/SearchProfileModal'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

/** Column header with a click-to-sort toggle: first click sorts ascending (A-Z /
 * smallest-first / oldest-first depending on the column), second click flips to
 * descending, third click clears back to the default "recently updated" order. */
function SortableTh({
  label,
  sortKey,
  sort,
  onSort,
  align,
}: {
  label: string
  sortKey: JobSortKey
  sort: JobSortState | null
  onSort: (key: JobSortKey) => void
  align?: 'center'
}) {
  const active = sort?.key === sortKey
  return (
    <th className={`px-2 py-2 ${align === 'center' ? 'text-center' : ''}`}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 transition hover:text-slate-700 ${active ? 'text-indigo-600' : ''}`}
      >
        {label}
        {active ? (
          sort.direction === 'asc' ? (
            <ArrowUp size={11} />
          ) : (
            <ArrowDown size={11} />
          )
        ) : (
          <ArrowUpDown size={11} className="text-slate-300" />
        )}
      </button>
    </th>
  )
}

interface PendingDelete {
  ids: string[]
  message: string
}

export function JobTrackerPage() {
  const applications = useLiveQuery(() => db.jobApplications.orderBy('updatedAt').reverse().toArray(), [], [])
  const cvs = useLiveQuery(() => db.cvs.orderBy('updatedAt').reverse().toArray(), [], [])
  const settings = useLiveQuery(() => getAppSettings(), [], null)
  const [importOpen, setImportOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
  const [sort, setSort] = useState<JobSortState | null>(null)

  function toggleSort(key: JobSortKey) {
    setSort((prev) => {
      if (prev?.key !== key) return { key, direction: 'asc' }
      if (prev.direction === 'asc') return { key, direction: 'desc' }
      return null
    })
  }

  const cvNameById = useMemo(() => new Map((cvs ?? []).map((cv) => [cv.id, cv.name])), [cvs])
  const list = useMemo(
    () => sortApplications(applications ?? [], sort, cvNameById, settings ?? DEFAULT_APP_SETTINGS),
    [applications, sort, cvNameById, settings],
  )
  const allSelected = list.length > 0 && selected.size === list.length

  // Only offers that actually got a red-band score and haven't been sent or flagged as
  // a recruiter/direct-email contact — those aren't "bad offers" in the scoring sense,
  // purging them here would just be data loss dressed up as cleanup.
  const discardedIds = useMemo(() => {
    if (!settings) return []
    return (applications ?? [])
      .filter((a) => !a.sent && !a.contactType && scoreBand(computeJobScore(a, settings).overall) === 'red')
      .map((a) => a.id)
  }, [applications, settings])

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(list.map((a) => a.id)))
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    await removeApplications(pendingDelete.ids)
    setSelected(new Set())
    setPendingDelete(null)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
        <Briefcase size={16} className="text-indigo-500" />
        <h1 className="text-sm font-semibold text-slate-800">Seguimiento de ofertas</h1>
        <span className="text-xs text-slate-400">
          {list.length} {list.length === 1 ? 'oferta' : 'ofertas'}
        </span>

        <div className="ml-auto flex items-center gap-2">
          {selected.size > 0 && (
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 size={14} />}
              onClick={() => setPendingDelete({ ids: [...selected], message: `Se eliminarán ${selected.size} oferta(s) seleccionada(s) de forma permanente.` })}
            >
              Eliminar ({selected.size})
            </Button>
          )}
          {discardedIds.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 size={14} />}
              onClick={() =>
                setPendingDelete({
                  ids: discardedIds,
                  message: `Se eliminarán ${discardedIds.length} oferta(s) con nota roja (descartadas) de forma permanente.`,
                })
              }
            >
              Eliminar descartadas ({discardedIds.length})
            </Button>
          )}
          <Button variant="outline" size="sm" icon={<UserCog size={14} />} onClick={() => setProfileOpen(true)}>
            Mi perfil
          </Button>
          <Button variant="outline" size="sm" icon={<Wand2 size={14} />} onClick={() => setImportOpen(true)}>
            Importar con IA
          </Button>
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => void addApplication()}>
            Añadir oferta
          </Button>
        </div>
      </div>

      <div className="thin-scrollbar flex-1 overflow-auto p-4">
        {list.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
            <Briefcase size={28} />
            <p className="text-sm">Aún no has añadido ninguna oferta.</p>
            <p className="text-xs">Usa "Importar con IA" o "Añadir oferta" para empezar.</p>
          </div>
        ) : (
          <table className="w-full min-w-[1520px] border-separate border-spacing-0 overflow-hidden rounded-xl border border-slate-200 bg-white text-left">
            <thead>
              <tr className="bg-slate-100 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-2 py-2">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="accent-indigo-600" />
                </th>
                <SortableTh label="Compañía" sortKey="company" sort={sort} onSort={toggleSort} />
                <SortableTh label="Oferta" sortKey="offerName" sort={sort} onSort={toggleSort} />
                <SortableTh label="Enlace" sortKey="link" sort={sort} onSort={toggleSort} />
                <SortableTh label="Ubicación" sortKey="location" sort={sort} onSort={toggleSort} />
                <SortableTh label="Modalidad" sortKey="workMode" sort={sort} onSort={toggleSort} />
                <th className="px-2 py-2">Contacto</th>
                <SortableTh label="Tecnologías" sortKey="technologies" sort={sort} onSort={toggleSort} />
                <SortableTh label="Años exp." sortKey="experienceYears" sort={sort} onSort={toggleSort} />
                <SortableTh label="Solicit." sortKey="applicantCount" sort={sort} onSort={toggleSort} />
                <SortableTh label="Nota" sortKey="score" sort={sort} onSort={toggleSort} align="center" />
                <SortableTh label="Publicada" sortKey="publishedDate" sort={sort} onSort={toggleSort} />
                <SortableTh label="Envío CV" sortKey="sentDate" sort={sort} onSort={toggleSort} />
                <SortableTh label="Enviada" sortKey="sent" sort={sort} onSort={toggleSort} align="center" />
                <SortableTh label="CV usado" sortKey="cvName" sort={sort} onSort={toggleSort} />
                <th className="px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {list.map((app) => (
                <JobApplicationRow
                  key={app.id}
                  app={app}
                  cvs={cvs ?? []}
                  settings={settings ?? DEFAULT_APP_SETTINGS}
                  selected={selected.has(app.id)}
                  onToggleSelect={() => toggleOne(app.id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ImportJobsModal open={importOpen} onClose={() => setImportOpen(false)} />
      <SearchProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />

      <Modal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Eliminar ofertas"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setPendingDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" size="sm" onClick={() => void confirmDelete()}>
              Eliminar
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">{pendingDelete?.message} Esta acción no se puede deshacer.</p>
      </Modal>
    </div>
  )
}
