import { useState } from 'react'
import { CalendarDays, Wand2 } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TextField, TextAreaField, CheckboxField } from '@/components/ui/Field'
import { IconButton, Button } from '@/components/ui/Button'
import { ImportCoverLetterModal } from '@/components/configurator/ImportCoverLetterModal'
import { DEFAULT_COVER_LETTER } from '@/lib/defaultData'
import { todayDateString } from '@/lib/jobTracker'
import { useCvStore } from '@/store/useCvStore'

export function CoverLetterForm() {
  const coverLetter = useCvStore((s) => s.draft?.coverLetter ?? DEFAULT_COVER_LETTER)
  const targetCompany = useCvStore((s) => s.draft?.targetCompany ?? '')
  const update = useCvStore((s) => s.updateCoverLetter)
  const [importOpen, setImportOpen] = useState(false)

  return (
    <div>
      <SectionHeader
        title="Carta de presentación"
        description="Va compaginada con este CV: comparte su plantilla de colores y tipografía para que ambos documentos se vean como un mismo paquete."
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <CheckboxField
            label="Incluir carta de presentación para este CV"
            checked={coverLetter.enabled}
            onChange={(e) => update({ enabled: e.target.checked })}
          />
          <Button variant="outline" size="sm" icon={<Wand2 size={13} />} onClick={() => setImportOpen(true)}>
            Importar con IA
          </Button>
        </div>

        {!coverLetter.enabled && (
          <p className="text-xs text-slate-400">
            Actívala para editarla y verla en la vista previa (con un selector "CV / Carta") y poder exportarla a PDF.
          </p>
        )}

        {coverLetter.enabled && (
          <div className="space-y-4 border-t border-slate-100 pt-4">
            <div className="grid grid-cols-2 gap-2.5">
              <TextField
                label="Destinatario"
                value={coverLetter.recipientName}
                onChange={(e) => update({ recipientName: e.target.value })}
                placeholder="Equipo de selección"
              />
              <label className="block">
                <span className="mb-1 flex items-baseline justify-between text-xs font-medium text-slate-600">
                  <span>Empresa</span>
                  {targetCompany && (
                    <button
                      type="button"
                      onClick={() => update({ recipientCompany: targetCompany })}
                      className="text-[11px] font-normal text-indigo-500 hover:underline"
                    >
                      Usar "{targetCompany}"
                    </button>
                  )}
                </span>
                <input
                  value={coverLetter.recipientCompany}
                  onChange={(e) => update({ recipientCompany: e.target.value })}
                  placeholder="Acme Corp"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
            </div>

            <div className="flex items-end gap-2">
              <TextField
                label="Fecha"
                type="date"
                value={coverLetter.date}
                onChange={(e) => update({ date: e.target.value })}
                className="flex-1"
              />
              <IconButton label="Usar la fecha de hoy" onClick={() => update({ date: todayDateString() })}>
                <CalendarDays size={15} />
              </IconButton>
            </div>

            <TextField
              label="Saludo"
              value={coverLetter.greeting}
              onChange={(e) => update({ greeting: e.target.value })}
              placeholder="Estimado equipo de selección,"
            />

            <TextAreaField
              label="Cuerpo de la carta"
              hint={`${coverLetter.body.length} caracteres`}
              value={coverLetter.body}
              onChange={(e) => update({ body: e.target.value })}
              placeholder="Escribo para presentar mi candidatura al puesto de… Cada párrafo se separa con una línea en blanco."
              rows={10}
            />

            <TextField
              label="Despedida"
              value={coverLetter.closing}
              onChange={(e) => update({ closing: e.target.value })}
              placeholder="Atentamente,"
            />
          </div>
        )}
      </div>

      <ImportCoverLetterModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  )
}
