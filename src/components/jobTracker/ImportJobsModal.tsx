import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Copy, Check, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { buildJobImportPrompt } from '@/lib/jobImportSchema'
import { parseImportedJobsJson, toApplicationInputs } from '@/lib/jobImport'
import { importApplications } from '@/lib/jobTracker'
import { getAppSettings } from '@/lib/settings'

export function ImportJobsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [jsonText, setJsonText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const settings = useLiveQuery(() => getAppSettings(), [], null)
  const prompt = buildJobImportPrompt(settings?.soughtPositions ?? [])

  function handleClose() {
    setJsonText('')
    setError(null)
    setSuccessMessage(null)
    onClose()
  }

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('No se pudo copiar automáticamente. Selecciona el texto del prompt y cópialo a mano.')
    }
  }

  async function handleImport() {
    setError(null)
    setSuccessMessage(null)
    const result = parseImportedJobsJson(jsonText)
    if (!result.ok) {
      setError(result.error)
      return
    }
    const count = await importApplications(toApplicationInputs(result.data))
    setSuccessMessage(`${count} ${count === 1 ? 'oferta añadida' : 'ofertas añadidas'} a la tabla.`)
    setJsonText('')
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Importar ofertas con IA"
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" size="sm" onClick={() => void handleImport()}>
            Importar JSON
          </Button>
        </>
      }
    >
      <div className="space-y-5 text-sm text-slate-600">
        <p>
          Copia el prompt, pégalo en ChatGPT (o la IA que prefieras) junto con los enlaces o el texto de las ofertas
          que hayas visto hoy, y te devolverá un JSON. Pégalo aquí abajo para añadirlas todas a la tabla de golpe.
          Esto no envía nada a ninguna IA por ti — la copia/pega la haces tú, y todo lo demás sigue siendo local.
        </p>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">1. Copia este prompt</span>
            <Button
              variant="outline"
              size="sm"
              icon={copied ? <Check size={13} /> : <Copy size={13} />}
              onClick={() => void handleCopyPrompt()}
            >
              {copied ? 'Copiado' : 'Copiar prompt'}
            </Button>
          </div>
          <textarea
            readOnly
            value={prompt}
            rows={6}
            onFocus={(e) => e.currentTarget.select()}
            className="thin-scrollbar w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-500 outline-none"
          />
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            2. Pega aquí el JSON que te devuelva
          </span>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={8}
            placeholder='{ "applications": [{ "company": "...", "offer": "..." }] }'
            className="thin-scrollbar w-full resize-y rounded-lg border border-slate-300 bg-white p-3 font-mono text-[11px] leading-relaxed text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {error && (
          <p className="flex items-start gap-1.5 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-600">
            <AlertCircle size={14} className="mt-0.5 shrink-0" /> {error}
          </p>
        )}

        {successMessage && (
          <p className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-700">
            <CheckCircle2 size={14} /> {successMessage}
          </p>
        )}
      </div>
    </Modal>
  )
}
