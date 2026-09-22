import { useRef, useState } from 'react'
import { Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ExportJsonModal } from '@/components/ui/ExportJsonModal'
import { readFileAsText } from '@/lib/downloadFile'
import { exportCvConfig, parseCvConfigJson } from '@/lib/cvConfig'
import { cvFileSlug } from '@/lib/cvExport'
import { useCvStore } from '@/store/useCvStore'

/** Exports/imports just the *design* of the current CV (theme + section order/
 * visibility) — deliberately separate from the CV's content (see the "Exportar JSON"
 * button in the header). The idea: set up your favorite look once, copy/save it, and
 * drop it onto every new CV instead of reconfiguring colors, fonts and density by hand
 * each time. Paste and file-upload both work, mirroring the "Importar con IA" modal. */
export function ConfigTransfer() {
  const draft = useCvStore((s) => s.draft)
  const applyConfig = useCvStore((s) => s.applyConfig)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function applyRaw(raw: string) {
    if (!draft) return
    const result = parseCvConfigJson(raw, draft)
    if (!result.ok) {
      setMessage({ type: 'error', text: result.error })
      return
    }
    applyConfig(result.data)
    setMessage({ type: 'ok', text: 'Configuración aplicada a este CV.' })
    setPasteText('')
  }

  async function handleFilePicked(file: File | undefined) {
    if (!file) return
    const raw = await readFileAsText(file).catch(() => null)
    if (raw === null) {
      setMessage({ type: 'error', text: 'No se pudo leer el archivo.' })
      return
    }
    applyRaw(raw)
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <h3 className="text-sm font-semibold text-slate-700">Guardar/aplicar esta configuración</h3>
      <p className="mt-1 text-[11px] text-slate-500">
        Solo el diseño (plantilla, colores, tipografía, densidad, secciones) — sin la información del CV — para
        copiarlo/guardarlo y aplicarlo luego a otros currículums en un clic.
      </p>

      <Button variant="outline" size="sm" icon={<Download size={13} />} onClick={() => setExportOpen(true)} className="mt-2.5 w-full">
        Exportar configuración
      </Button>

      <div className="mt-2.5">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">Pega aquí una configuración exportada</span>
          <Button variant="outline" size="sm" icon={<Upload size={12} />} onClick={() => fileInputRef.current?.click()}>
            Subir archivo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              void handleFilePicked(e.target.files?.[0])
              e.target.value = ''
            }}
          />
        </div>
        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          rows={3}
          placeholder='{ "theme": { "templateId": "sidebar", ... }, "sectionOrder": [...] }'
          className="thin-scrollbar w-full resize-y rounded-lg border border-slate-300 bg-white p-2 font-mono text-[11px] leading-relaxed text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={() => applyRaw(pasteText)}
          disabled={!pasteText.trim()}
          className="mt-1.5 w-full"
        >
          Aplicar JSON pegado
        </Button>
      </div>

      {message && (
        <p
          className={`mt-2 flex items-center gap-1.5 rounded-md p-2 text-[11px] ${
            message.type === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
          }`}
        >
          {message.type === 'ok' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
          {message.text}
        </p>
      )}

      {draft && (
        <ExportJsonModal
          open={exportOpen}
          onClose={() => setExportOpen(false)}
          title="Exportar configuración"
          description="Solo el diseño de este CV (plantilla, colores, tipografía, densidad, secciones) — sin ninguna información del currículum. Cópialo y pégalo en el recuadro de abajo en cualquier otro CV para aplicarle el mismo diseño."
          data={exportCvConfig(draft)}
          filename={`configuracion-${cvFileSlug(draft.name)}.json`}
        />
      )}
    </div>
  )
}
