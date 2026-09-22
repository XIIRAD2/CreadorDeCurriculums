import { useRef, useState } from 'react'
import { Copy, Check, AlertCircle, CheckCircle2, Upload } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { AI_IMPORT_PROMPT } from '@/lib/importSchema'
import { parseImportedJson, summarizeImportCounts } from '@/lib/importCv'
import { readFileAsText } from '@/lib/downloadFile'
import { useCvStore } from '@/store/useCvStore'

type Mode = 'current' | 'new'

const MODE_OPTIONS: { id: Mode; label: string }[] = [
  { id: 'current', label: 'Añadir al CV actual' },
  { id: 'new', label: 'Crear un CV nuevo' },
]

export function ImportJsonModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [jsonText, setJsonText] = useState('')
  const [mode, setMode] = useState<Mode>('current')
  const [error, setError] = useState<string | null>(null)
  const [successLines, setSuccessLines] = useState<string[] | null>(null)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const applyImport = useCvStore((s) => s.applyImport)
  const createCv = useCvStore((s) => s.createCv)
  const saveNow = useCvStore((s) => s.saveNow)

  function handleClose() {
    setJsonText('')
    setError(null)
    setSuccessLines(null)
    onClose()
  }

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(AI_IMPORT_PROMPT)
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
    setSuccessLines(null)
    const result = parseImportedJson(jsonText)
    if (!result.ok) {
      setError(result.error)
      return
    }

    if (mode === 'new') {
      const name = [result.data.personal?.firstName, result.data.personal?.lastName].filter(Boolean).join(' ').trim()
      await createCv(name ? `CV - ${name}` : 'CV importado')
    }

    const counts = applyImport(result.data)
    await saveNow()
    const lines = summarizeImportCounts(counts)
    setSuccessLines(lines.length > 0 ? lines : ['El JSON no tenía datos que se pudieran importar.'])
    setJsonText('')
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Importar con IA"
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
          Copia el prompt, pégalo en ChatGPT (o la IA que prefieras) junto con tu información, y te devolverá un JSON.
          Pega ese JSON aquí abajo para rellenar tu CV entero de golpe. Esto no envía nada a ninguna IA por ti — la
          copia/pega la haces tú, y todo lo demás sigue siendo local.
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
            value={AI_IMPORT_PROMPT}
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
            placeholder='{ "personal": { "firstName": "..." }, "experience": [...] }'
            className="thin-scrollbar w-full resize-y rounded-lg border border-slate-300 bg-white p-3 font-mono text-[11px] leading-relaxed text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">¿Dónde lo incorporo?</span>
          <div className="grid grid-cols-2 gap-2">
            {MODE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setMode(option.id)}
                className={`rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${
                  mode === option.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {mode === 'current' && (
            <p className="mt-1.5 text-[11px] text-amber-600">
              Las secciones que traiga el JSON (habilidades, experiencia…) sustituirán a las del CV que tienes abierto.
              Los datos personales solo se rellenan donde el CV actual esté vacío.
            </p>
          )}
        </div>

        {error && (
          <p className="flex items-start gap-1.5 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-600">
            <AlertCircle size={14} className="mt-0.5 shrink-0" /> {error}
          </p>
        )}

        {successLines && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
            <p className="mb-1 flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={14} /> Importado correctamente
            </p>
            <ul className="list-inside list-disc space-y-0.5">
              {successLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  )
}
