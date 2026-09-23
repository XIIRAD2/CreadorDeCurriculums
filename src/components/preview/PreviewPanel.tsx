import { useRef, useState } from 'react'
import { Minus, Plus, Download, FileWarning, FileText, Mail } from 'lucide-react'
import type { CvDocument } from '@/types/cv'
import { CvPreview } from '@/components/preview/CvPreview'
import { CoverLetterPreview } from '@/components/preview/CoverLetterPreview'
import { DEFAULT_COVER_LETTER } from '@/lib/defaultData'
import { IconButton, Button } from '@/components/ui/Button'
import { exportCvPdf, exportCoverLetterPdf } from '@/lib/exportPdf'
import { PAGE_WIDTH_PX, PAGE_GAP_PX } from '@/components/preview/pageSize'

const ZOOM_MIN = 0.4
const ZOOM_MAX = 1.4
const ZOOM_STEP = 0.1

type DocType = 'cv' | 'letter'

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

export function PreviewPanel({ cv }: { cv: CvDocument }) {
  const pageRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(0.82)
  const [pageCount, setPageCount] = useState(1)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [docType, setDocType] = useState<DocType>('cv')

  const letterEnabled = (cv.coverLetter ?? DEFAULT_COVER_LETTER).enabled
  const showingLetter = docType === 'letter' && letterEnabled
  // The scaled wrapper below needs an explicit width to reserve — `transform: scale()`
  // doesn't affect layout size, so without this the scroll container wouldn't know how
  // far right multiple side-by-side pages actually extend.
  const contentWidth = showingLetter ? PAGE_WIDTH_PX : pageCount * PAGE_WIDTH_PX + (pageCount - 1) * PAGE_GAP_PX

  async function handleExport() {
    setExporting(true)
    setExportError(null)
    try {
      const name = slugify(`${cv.personal.firstName}-${cv.personal.lastName}`) || 'curriculum'
      if (showingLetter) {
        await exportCoverLetterPdf(cv, `carta-${name}`)
      } else {
        await exportCvPdf(cv, `cv-${name}`)
      }
    } catch (err) {
      console.error('Error exportando a PDF', err)
      setExportError('No se pudo generar el PDF. Inténtalo de nuevo.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <IconButton label="Alejar" onClick={() => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))}>
              <Minus size={15} />
            </IconButton>
            <span className="w-11 text-center text-xs font-medium text-slate-500">{Math.round(zoom * 100)}%</span>
            <IconButton label="Acercar" onClick={() => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))}>
              <Plus size={15} />
            </IconButton>
            <span className="ml-2 hidden text-xs text-slate-400 sm:inline">
              A4 · {showingLetter ? 1 : pageCount} {(showingLetter ? 1 : pageCount) === 1 ? 'página' : 'páginas'}
            </span>
          </div>

          {letterEnabled && (
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setDocType('cv')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  !showingLetter ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <FileText size={13} /> CV
              </button>
              <button
                type="button"
                onClick={() => setDocType('letter')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  showingLetter ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Mail size={13} /> Carta
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {exportError && (
            <span className="flex items-center gap-1 text-xs text-rose-500">
              <FileWarning size={13} /> {exportError}
            </span>
          )}
          <Button variant="primary" size="sm" icon={<Download size={14} />} onClick={() => void handleExport()} disabled={exporting}>
            {exporting ? 'Generando…' : showingLetter ? 'Exportar carta a PDF' : 'Exportar a PDF'}
          </Button>
        </div>
      </div>

      <div className="thin-scrollbar flex-1 overflow-auto p-8">
        <div className="mx-auto" style={{ width: contentWidth * zoom }}>
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', width: contentWidth }}>
            {showingLetter ? (
              <CoverLetterPreview cv={cv} pageRef={pageRef} />
            ) : (
              <CvPreview cv={cv} onPageCountChange={setPageCount} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
