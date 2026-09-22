import { useState } from 'react'
import { Copy, Check, Download } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { downloadJsonFile } from '@/lib/downloadFile'

interface ExportJsonModalProps {
  open: boolean
  onClose: () => void
  title: string
  description: string
  data: unknown
  filename: string
}

/** Copy-paste-first JSON export — mirrors "Importar con IA": a readonly textarea with
 * the JSON right there to select/copy, so it can go straight into another CV's import
 * without ever touching the filesystem. A "Descargar archivo" button stays available
 * for whoever does want a file (e.g. to keep as a backup, or upload it back via the
 * import modals' file picker). */
export function ExportJsonModal({ open, onClose, title, description, data, filename }: ExportJsonModalProps) {
  const [copied, setCopied] = useState(false)
  const json = JSON.stringify(data, null, 2)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard permission denied or unavailable — the textarea's onFocus already
      // selects everything, so the user can still copy manually with Ctrl+C.
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="outline" size="sm" icon={<Download size={13} />} onClick={() => void downloadJsonFile(filename, data)}>
            Descargar archivo
          </Button>
          <Button variant="primary" size="sm" icon={copied ? <Check size={14} /> : <Copy size={14} />} onClick={() => void handleCopy()}>
            {copied ? 'Copiado' : 'Copiar'}
          </Button>
        </>
      }
    >
      <div className="space-y-3 text-sm text-slate-600">
        <p>{description}</p>
        <textarea
          readOnly
          value={json}
          rows={16}
          onFocus={(e) => e.currentTarget.select()}
          className="thin-scrollbar w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-700 outline-none"
        />
      </div>
    </Modal>
  )
}
