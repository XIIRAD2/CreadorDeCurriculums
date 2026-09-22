import { useRef, useState } from 'react'
import { Copy, Check, AlertCircle, CheckCircle2, Upload } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { COVER_LETTER_IMPORT_PROMPT } from '@/lib/coverLetterImportSchema'
import { parseImportedCoverLetterJson, toCoverLetterPatch } from '@/lib/coverLetterImport'
import { readFileAsText } from '@/lib/downloadFile'
import { useCvStore } from '@/store/useCvStore'

export function ImportCoverLetterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [jsonText, setJsonText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateCoverLetter = useCvStore((s) => s.updateCoverLetter)
  const saveNow = useCvStore((s) => s.saveNow)

  function handleClose() {
    setJsonText('')
    setError(null)
    setSuccess(false)
    onClose()
  }

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(COVER_LETTER_IMPORT_PROMPT)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('No se pudo copiar automáticamente. Selecciona el texto del prompt y cópialo a mano.')
    }
  }

  async function handleFilePicked(file: File | undefined) {
    if (!file) return
    setError(null)
    try {
      setJsonText(await readFileAsText(file))
    } catch {
      setError('No se pudo leer el archivo.')
    }
  }

  async function handleImport() {
    setError(null)
    setSuccess(false)
    const result = parseImportedCoverLetterJson(jsonText)
    if (!result.ok) {
      setError(result.error)
      return
    }
    updateCoverLetter(toCoverLetterPatch(result.data))
    await saveNow()
    setSuccess(true)
    setJsonText('')
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Importar carta con IA"
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
          Copia el prompt, pégalo en ChatGPT (o la IA que prefieras) junto con tu CV/experiencia y la oferta a la
          que aplicas, y te redactará la carta. Pega el JSON que te devuelva aquí abajo para rellenarla de golpe
          (y activarla si no lo estaba). Esto no envía nada a ninguna IA por ti — la copia/pega la haces tú.
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
            value={COVER_LETTER_IMPORT_PROMPT}
            rows={6}
            onFocus={(e) => e.currentTarget.select()}
            className="thin-scrollbar w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-500 outline-none"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              2. Pega aquí el JSON que te devuelva
            </span>
            <Button variant="outline" size="sm" icon={<Upload size={13} />} onClick={() => fileInputRef.current?.click()}>
              Subir archivo .json
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
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={8}
            placeholder='{ "recipientCompany": "...", "greeting": "...", "body": "..." }'
            className="thin-scrollbar w-full resize-y rounded-lg border border-slate-300 bg-white p-3 font-mono text-[11px] leading-relaxed text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {error && (
          <p className="flex items-start gap-1.5 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-600">
            <AlertCircle size={14} className="mt-0.5 shrink-0" /> {error}
          </p>
        )}

        {success && (
          <p className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-700">
            <CheckCircle2 size={14} /> Carta importada y activada.
          </p>
        )}
      </div>
    </Modal>
  )
}
