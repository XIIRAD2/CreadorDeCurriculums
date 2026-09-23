import { useState } from 'react'
import { ExternalLink, Globe, Trash2 } from 'lucide-react'
import { WORK_MODE_LABELS, CONTACT_TYPE_LABELS, type WorkMode, type ContactType } from '@/types/jobTracker'
import type { JobApplication } from '@/types/jobTracker'
import type { CvDocument } from '@/types/cv'
import type { AppSettings } from '@/types/settings'
import { updateApplication, setApplicationSent, removeApplication } from '@/lib/jobTracker'
import { shortenUrl, toHref, sanitizeLink } from '@/lib/urlShorten'
import { openExternalUrl } from '@/lib/openExternal'
import { computeJobScore, scoreBand } from '@/lib/jobScore'
import { IconButton } from '@/components/ui/Button'
import { useCvStore } from '@/store/useCvStore'
import { useViewStore } from '@/store/useViewStore'

const cellInput =
  'w-full min-w-0 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100'

interface RowProps {
  app: JobApplication
  cvs: CvDocument[]
  settings: AppSettings
  selected: boolean
  onToggleSelect: () => void
}

/** Row background: an already-sent offer always wins (it's a done deal, no need for a
 * recommendation anymore); then the hand-set contact type (these aren't "should I
 * apply" scores at all); only then the computed fit score band. Order matters — this is
 * a precedence chain, not independent flags. */
function rowBackgroundClass(app: JobApplication, band: ReturnType<typeof scoreBand>): string {
  if (app.sent) return 'bg-emerald-50/70'
  if (app.contactType === 'recruiter') return 'bg-blue-50/70'
  if (app.contactType === 'direct-email') return 'bg-orange-50/70'
  if (band === 'green') return 'bg-emerald-50/70'
  if (band === 'yellow') return 'bg-amber-50/70'
  if (band === 'red') return 'bg-rose-50/60'
  return 'hover:bg-slate-50'
}

const SCORE_TEXT_CLASS: Record<ReturnType<typeof scoreBand>, string> = {
  green: 'text-emerald-600',
  yellow: 'text-amber-600',
  red: 'text-rose-600',
  unscored: 'text-slate-400',
}

/** One factor's mini-bar within the score breakdown — an empty gray track means that
 * factor had no data at all (dropped from the average, not scored as 0), same
 * "unscored, not penalized" distinction `computeJobScore` already makes. */
function ScoreBar({ value, colorClass }: { value: number | null; colorClass: string }) {
  return (
    <div className="h-[3px] w-full overflow-hidden rounded-full bg-slate-200">
      {value !== null && <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${value}%` }} />}
    </div>
  )
}

/** Compact fit-score cell: the overall number plus a 3-bar breakdown (tech/experience/
 * competition) always visible underneath, instead of only on hover — so it's clear at a
 * glance *which* factor is dragging a low score down, not just that it's low. */
function ScoreBreakdown({ score, band }: { score: ReturnType<typeof computeJobScore>; band: ReturnType<typeof scoreBand> }) {
  return (
    <div
      className="mx-auto flex w-12 flex-col items-center gap-1"
      title={
        score.overall === null
          ? 'Configura "Mi perfil de búsqueda" para calcular una nota'
          : `Tecnología ${score.tech ?? '—'} · Experiencia ${score.experience ?? '—'} · Competencia ${score.competition ?? '—'}`
      }
    >
      <span className={`text-xs font-semibold ${SCORE_TEXT_CLASS[band]}`}>{score.overall ?? '—'}</span>
      <div className="flex w-full flex-col gap-[2px]">
        <ScoreBar value={score.tech} colorClass="bg-indigo-500" />
        <ScoreBar value={score.experience} colorClass="bg-violet-500" />
        <ScoreBar value={score.competition} colorClass="bg-amber-500" />
      </div>
    </div>
  )
}

/** One row of the tracker grid. Text fields (company, offer, technologies) are
 * uncontrolled with `defaultValue` + commit-on-blur, spreadsheet-style, so typing never
 * fights a re-render triggered by the write it just caused. Discrete fields (dates,
 * the sent checkbox, the linked CV) commit immediately since there's no typing to race. */
export function JobApplicationRow({ app, cvs, settings, selected, onToggleSelect }: RowProps) {
  const [editingLink, setEditingLink] = useState(false)
  const loadCv = useCvStore((s) => s.loadCv)
  const setView = useViewStore((s) => s.setView)

  const score = computeJobScore(app, settings)
  const band = scoreBand(score.overall)

  function commit(patch: Partial<JobApplication>) {
    void updateApplication(app.id, patch)
  }

  function openLinkedCv() {
    if (!app.cvId) return
    void loadCv(app.cvId)
    setView('cv')
  }

  return (
    <tr className={`border-b border-slate-100 transition ${rowBackgroundClass(app, band)}`}>
      <td className="px-2 py-1.5 text-center">
        <input type="checkbox" checked={selected} onChange={onToggleSelect} className="accent-indigo-600" />
      </td>

      <td className="min-w-[140px] px-1 py-1">
        <input
          defaultValue={app.company}
          onBlur={(e) => commit({ company: e.target.value.trim() })}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          placeholder="Empresa"
          className={cellInput}
        />
      </td>

      <td className="min-w-[160px] px-1 py-1">
        <input
          defaultValue={app.offerName}
          onBlur={(e) => commit({ offerName: e.target.value.trim() })}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          placeholder="Puesto"
          className={cellInput}
        />
      </td>

      <td className="min-w-[150px] px-1 py-1">
        {editingLink ? (
          <input
            autoFocus
            defaultValue={app.link}
            onBlur={(e) => {
              commit({ link: sanitizeLink(e.target.value) })
              setEditingLink(false)
            }}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            placeholder="https://..."
            className={cellInput}
          />
        ) : app.link ? (
          <div className="flex items-center gap-1 px-1 py-1">
            {/* Keeps a real href (right-click "copy link", hover preview, screen
                readers) but the actual open goes through openExternalUrl: a plain
                target="_blank" does nothing inside the desktop app's webview, which
                blocks that kind of external navigation by default. sanitizeLink/toHref
                clean up AI-provided links that arrive wrapped in Markdown first. */}
            <a
              href={toHref(app.link)}
              onClick={(e) => {
                e.preventDefault()
                void openExternalUrl(toHref(app.link))
              }}
              title={`Abrir oferta: ${app.link}`}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-indigo-600 transition hover:bg-indigo-50"
            >
              <Globe size={15} />
            </a>
            <span className="truncate text-xs text-slate-500" title={app.link}>
              {shortenUrl(app.link)}
            </span>
            <button
              type="button"
              onClick={() => setEditingLink(true)}
              className="shrink-0 text-[10px] text-slate-400 hover:text-slate-600"
            >
              editar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditingLink(true)}
            className="px-2 py-1.5 text-xs text-slate-400 hover:text-indigo-600"
          >
            + Añadir enlace
          </button>
        )}
      </td>

      <td className="min-w-[130px] px-1 py-1">
        <input
          defaultValue={app.location ?? ''}
          onBlur={(e) => commit({ location: e.target.value.trim() })}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          placeholder="Ciudad, provincia"
          className={cellInput}
        />
      </td>

      <td className="w-[100px] px-1 py-1">
        <select
          value={app.workMode ?? ''}
          onChange={(e) => commit({ workMode: e.target.value as WorkMode })}
          className={`${cellInput} text-xs`}
        >
          {(Object.entries(WORK_MODE_LABELS) as [WorkMode, string][]).map(([mode, label]) => (
            <option key={mode || 'none'} value={mode}>
              {label}
            </option>
          ))}
        </select>
      </td>

      <td className="w-[110px] px-1 py-1">
        <select
          value={app.contactType ?? ''}
          onChange={(e) => commit({ contactType: e.target.value as ContactType })}
          className={`${cellInput} text-xs`}
        >
          {(Object.entries(CONTACT_TYPE_LABELS) as [ContactType, string][]).map(([type, label]) => (
            <option key={type || 'normal'} value={type}>
              {label}
            </option>
          ))}
        </select>
      </td>

      <td className="min-w-[160px] px-1 py-1">
        <input
          defaultValue={app.technologies.join(', ')}
          onBlur={(e) =>
            commit({
              technologies: e.target.value
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          placeholder="React, Node.js…"
          className={cellInput}
        />
      </td>

      <td className="w-[70px] px-1 py-1">
        <input
          type="number"
          min={0}
          max={99}
          defaultValue={app.experienceYears ?? ''}
          onBlur={(e) => {
            const raw = e.target.value.trim()
            commit({ experienceYears: raw === '' ? null : Math.max(0, Math.round(Number(raw))) })
          }}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          placeholder="—"
          className={`${cellInput} text-center`}
        />
      </td>

      <td className="w-[75px] px-1 py-1">
        <input
          type="number"
          min={0}
          defaultValue={app.applicantCount ?? ''}
          onBlur={(e) => {
            const raw = e.target.value.trim()
            commit({ applicantCount: raw === '' ? null : Math.max(0, Math.round(Number(raw))) })
          }}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          placeholder="—"
          className={`${cellInput} text-center`}
        />
      </td>

      <td className="w-[72px] px-1.5 py-1">
        <ScoreBreakdown score={score} band={band} />
      </td>

      <td className="px-1 py-1">
        <input
          type="date"
          defaultValue={app.publishedDate}
          onChange={(e) => commit({ publishedDate: e.target.value })}
          className={`${cellInput} text-xs`}
        />
      </td>

      <td className="px-1 py-1">
        <input
          type="date"
          defaultValue={app.sentDate}
          onChange={(e) => commit({ sentDate: e.target.value })}
          className={`${cellInput} text-xs`}
        />
      </td>

      <td className="px-2 py-1.5 text-center">
        <input
          type="checkbox"
          checked={app.sent}
          onChange={(e) => void setApplicationSent(app.id, e.target.checked)}
          className="h-4 w-4 accent-emerald-600"
        />
      </td>

      <td className="min-w-[170px] px-1 py-1">
        <div className="flex items-center gap-1">
          <select
            value={app.cvId ?? ''}
            onChange={(e) => commit({ cvId: e.target.value || null })}
            className={`${cellInput} text-xs`}
          >
            <option value="">— Sin CV —</option>
            {cvs.map((cv) => (
              <option key={cv.id} value={cv.id}>
                {cv.name}
              </option>
            ))}
          </select>
          <IconButton label="Abrir currículum" disabled={!app.cvId} onClick={openLinkedCv}>
            <ExternalLink size={13} />
          </IconButton>
        </div>
      </td>

      <td className="px-1 py-1 text-center">
        <IconButton variant="danger" label="Eliminar oferta" onClick={() => void removeApplication(app.id)}>
          <Trash2 size={13} />
        </IconButton>
      </td>
    </tr>
  )
}
