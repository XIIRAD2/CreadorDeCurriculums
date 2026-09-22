import { Eye, EyeOff } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ColorPickerPopover } from '@/components/ui/ColorPickerPopover'
import { SortableList } from '@/components/ui/SortableList'
import { ConfigTransfer } from '@/components/configurator/ConfigTransfer'
import { COLOR_PALETTES } from '@/lib/palettes'
import { FONT_PAIRINGS } from '@/lib/fonts'
import { SECTION_LABELS, type SectionId, type Density, type PhotoShape, type TemplateId, type DescriptionStyle } from '@/types/cv'
import { useCvStore } from '@/store/useCvStore'

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: 'sidebar', label: 'Barra lateral' },
  { id: 'minimal', label: 'Minimalista' },
  { id: 'two-column', label: 'Dos columnas' },
  { id: 'elegant', label: 'Elegante' },
  { id: 'compact-ats', label: 'ATS compacta' },
]

const DENSITIES: { id: Density; label: string }[] = [
  { id: 'compact', label: 'Compacta' },
  { id: 'comfortable', label: 'Media' },
  { id: 'spacious', label: 'Amplia' },
]

const DESCRIPTION_STYLES: { id: DescriptionStyle; label: string; hint: string }[] = [
  { id: 'paragraph', label: 'Párrafo', hint: 'Texto seguido' },
  { id: 'bullets', label: 'Lista con viñetas', hint: 'Una línea = un punto' },
]

const PHOTO_SHAPES: { id: PhotoShape; label: string; radius: string }[] = [
  { id: 'circle', label: 'Circular', radius: '9999px' },
  { id: 'rounded', label: 'Redondeada', radius: '10px' },
  { id: 'square', label: 'Cuadrada', radius: '0px' },
  { id: 'corner', label: 'Esquina', radius: '0px' },
]

function TemplateThumb({ id, color }: { id: TemplateId; color: string }) {
  if (id === 'sidebar') {
    return (
      <span className="flex h-12 w-full overflow-hidden rounded-md border border-slate-200 bg-white">
        <span className="h-full w-1/3" style={{ backgroundColor: color }} />
        <span className="flex-1 space-y-1 p-1.5">
          <span className="block h-1 w-3/4 rounded bg-slate-200" />
          <span className="block h-1 w-full rounded bg-slate-200" />
          <span className="block h-1 w-2/3 rounded bg-slate-200" />
        </span>
      </span>
    )
  }
  if (id === 'two-column') {
    return (
      <span className="flex h-12 w-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white">
        <span className="h-2 w-full" style={{ backgroundColor: color }} />
        <span className="flex flex-1">
          <span className="w-1/3 space-y-1 border-r border-slate-100 p-1.5">
            <span className="block h-1 w-full rounded bg-slate-200" />
            <span className="block h-1 w-2/3 rounded bg-slate-200" />
          </span>
          <span className="flex-1 space-y-1 p-1.5">
            <span className="block h-1 w-full rounded bg-slate-200" />
            <span className="block h-1 w-3/4 rounded bg-slate-200" />
          </span>
        </span>
      </span>
    )
  }
  if (id === 'elegant') {
    return (
      <span className="flex h-12 w-full flex-col items-center overflow-hidden rounded-md border border-slate-200 bg-white p-1.5">
        <span className="block h-1 w-1/2 rounded bg-slate-300" />
        <span className="mt-1 block h-[3px] w-4 rounded-full" style={{ backgroundColor: color }} />
        <span className="mt-1.5 block h-1 w-3/4 rounded bg-slate-200" />
        <span className="mt-1 block h-1 w-2/3 rounded bg-slate-200" />
      </span>
    )
  }
  if (id === 'compact-ats') {
    return (
      <span className="flex h-12 w-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white p-1.5">
        <span className="block h-1 w-2/3 rounded bg-slate-400" />
        <span className="mt-1 block h-[2px] w-full" style={{ backgroundColor: color }} />
        <span className="mt-1.5 block h-1 w-full rounded bg-slate-200" />
        <span className="mt-1 block h-1 w-3/4 rounded bg-slate-200" />
      </span>
    )
  }
  return (
    <span className="flex h-12 w-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white">
      <span className="h-2.5 w-full" style={{ backgroundColor: color }} />
      <span className="flex-1 space-y-1 p-1.5">
        <span className="block h-1 w-3/4 rounded bg-slate-200" />
        <span className="block h-1 w-full rounded bg-slate-200" />
      </span>
    </span>
  )
}

export function DesignForm() {
  const theme = useCvStore((s) => s.draft?.theme)
  const sectionOrder = useCvStore((s) => s.draft?.sectionOrder)
  const hiddenSections = useCvStore((s) => s.draft?.hiddenSections)
  const updateTheme = useCvStore((s) => s.updateTheme)
  const applyPalette = useCvStore((s) => s.applyPalette)
  const applyFontPairing = useCvStore((s) => s.applyFontPairing)
  const reorderSections = useCvStore((s) => s.reorderSections)
  const toggleSectionVisibility = useCvStore((s) => s.toggleSectionVisibility)

  if (!theme || !sectionOrder || !hiddenSections) return null

  return (
    <div>
      <SectionHeader title="Diseño" description="Colores, tipografía y estructura. Se aplica al instante en la vista previa." />

      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Plantilla</h3>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => updateTheme({ templateId: t.id })}
                className={`rounded-lg border p-1.5 text-left transition ${
                  theme.templateId === t.id ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <TemplateThumb id={t.id} color={theme.primaryColor} />
                <span className="mt-1.5 block text-xs font-medium text-slate-600">{t.label}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Minimalista, Elegante y ATS compacta son de una sola columna — las más fáciles de leer para los lectores
            automáticos de currículums (ATS). ATS compacta además no muestra foto, para el máximo de compatibilidad.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Tabla de colores</h3>
          <div className="grid grid-cols-6 gap-2">
            {COLOR_PALETTES.map((p) => (
              <button
                key={p.id}
                type="button"
                title={p.label}
                onClick={() => applyPalette(p.id)}
                className={`h-8 w-8 rounded-full border-2 transition ${
                  theme.paletteId === p.id ? 'border-indigo-500' : 'border-white'
                } ring-1 ring-slate-200`}
                style={{ background: `linear-gradient(135deg, ${p.primary} 50%, ${p.accent} 50%)` }}
              />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <ColorPickerPopover
              label="Color principal"
              color={theme.primaryColor}
              onChange={(hex) => updateTheme({ primaryColor: hex, paletteId: 'custom' })}
            />
            <ColorPickerPopover
              label="Color de acento"
              color={theme.accentColor}
              onChange={(hex) => updateTheme({ accentColor: hex, paletteId: 'custom' })}
            />
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Tipografía</h3>
          <div className="grid grid-cols-2 gap-2">
            {FONT_PAIRINGS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => applyFontPairing(f.id)}
                className={`rounded-lg border px-2.5 py-2 text-left transition ${
                  theme.fontPairingId === f.id ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span style={{ fontFamily: f.heading }} className="block text-sm text-slate-800">
                  {f.label}
                </span>
                <span style={{ fontFamily: f.body }} className="block text-[11px] text-slate-400">
                  Aa Bb Cc
                </span>
              </button>
            ))}
          </div>
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
              <span>Tamaño de letra</span>
              <span className="text-slate-400">{Math.round(theme.fontScale * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.85}
              max={1.15}
              step={0.01}
              value={theme.fontScale}
              onChange={(e) => updateTheme({ fontScale: Number(e.target.value) })}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600"
            />
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Densidad</h3>
          <div className="grid grid-cols-3 gap-2">
            {DENSITIES.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => updateTheme({ density: d.id })}
                className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                  theme.density === d.id
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Formato de párrafos</h3>
          <p className="mb-2 text-xs text-slate-500">
            Cómo se muestran las descripciones de experiencia, educación y proyectos.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DESCRIPTION_STYLES.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => updateTheme({ descriptionStyle: d.id })}
                className={`rounded-lg border px-3 py-2 text-left transition ${
                  (theme.descriptionStyle ?? 'paragraph') === d.id
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="block text-xs font-medium">{d.label}</span>
                <span className="block text-[11px] opacity-70">{d.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Foto</h3>
          <label className="mb-2 flex select-none items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={theme.showPhoto}
              onChange={(e) => updateTheme({ showPhoto: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
            />
            Mostrar foto en el CV
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PHOTO_SHAPES.map((s) => (
              <button
                key={s.id}
                type="button"
                disabled={!theme.showPhoto}
                onClick={() => updateTheme({ photoShape: s.id })}
                className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-2 transition disabled:opacity-40 ${
                  theme.photoShape === s.id ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span
                  className="h-6 w-6 bg-slate-400"
                  style={{ borderRadius: s.radius, backgroundColor: theme.primaryColor }}
                />
                <span className="text-[11px] text-slate-600">{s.label}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            "Esquina" hace que la foto ocupe toda la esquina superior izquierda de la cabecera, sin marco ni margen —
            no disponible en Elegante (foto centrada) ni ATS compacta (nunca muestra foto).
          </p>

          {theme.showPhoto && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
                <span>Tamaño de la foto</span>
                <span className="text-slate-400">{Math.round((theme.photoZoom ?? 1) * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.6}
                max={2}
                step={0.1}
                value={theme.photoZoom ?? 1}
                onChange={(e) => updateTheme({ photoZoom: Number(e.target.value) })}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Agranda o encoge el recuadro de la foto (círculo/marco/esquina). Sube el
                tamaño si la foto queda muy recortada/con demasiado zoom en la cara.
              </p>
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Secciones</h3>
          <p className="mb-2 text-xs text-slate-500">Arrastra para reordenar y usa el icono para ocultar una sección.</p>
          <SortableList
            items={sectionOrder.map((id) => ({ id }))}
            onReorder={(ids) => reorderSections(ids as SectionId[])}
            className="space-y-1.5"
            renderItem={({ id }) => {
              const hidden = hiddenSections.includes(id)
              return (
                <div
                  className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-sm ${
                    hidden ? 'border-slate-100 bg-slate-50 text-slate-400' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {SECTION_LABELS[id]}
                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility(id)}
                    aria-label={hidden ? 'Mostrar sección' : 'Ocultar sección'}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    {hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              )
            }}
          />
        </div>

        <ConfigTransfer />
      </div>
    </div>
  )
}
