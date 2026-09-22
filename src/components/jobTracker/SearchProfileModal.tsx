import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, X } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button, IconButton } from '@/components/ui/Button'
import { TechLogo } from '@/components/ui/TechLogo'
import {
  getAppSettings,
  addBaseTechnology,
  toggleBaseTechnology,
  addSoughtPosition,
  updateSoughtPosition,
  removeSoughtPosition,
  SUGGESTED_BASE_TECHNOLOGIES,
} from '@/lib/settings'
import { EXPERIENCE_LEVEL_LABELS } from '@/types/settings'
import type { ExperienceLevel } from '@/types/settings'

const LEVELS: ExperienceLevel[] = ['junior', 'intermediate', 'senior']

export function SearchProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const settings = useLiveQuery(() => getAppSettings(), [], null)
  const [newTech, setNewTech] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newLevel, setNewLevel] = useState<ExperienceLevel>('intermediate')

  if (!settings) return null

  const allTags = Array.from(new Set([...SUGGESTED_BASE_TECHNOLOGIES, ...settings.baseTechnologies]))
  const selected = new Set(settings.baseTechnologies.map((t) => t.toLowerCase()))

  async function handleAddTech() {
    if (!newTech.trim()) return
    await addBaseTechnology(newTech)
    setNewTech('')
  }

  async function handleAddPosition() {
    if (!newTitle.trim()) return
    await addSoughtPosition(newTitle.trim(), newLevel)
    setNewTitle('')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Mi perfil de búsqueda"
      size="lg"
      footer={
        <Button variant="primary" size="sm" onClick={onClose}>
          Listo
        </Button>
      }
    >
      <div className="space-y-6 text-sm text-slate-600">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Tecnologías que dominas</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Tu "CV general" — la base para calcular qué tan bien encaja cada oferta contigo. Selecciona las que
            apliquen (puedes marcar varias) o añade una que no esté en la lista.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {allTags.map((tag) => {
              const isSelected = selected.has(tag.toLowerCase())
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => void toggleBaseTechnology(tag)}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <TechLogo name={tag} size={12} />
                  {tag}
                </button>
              )
            })}
          </div>
          <div className="mt-2.5 flex gap-2">
            <input
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void handleAddTech()}
              placeholder="Añadir otra tecnología…"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <Button variant="outline" size="sm" icon={<Plus size={13} />} onClick={() => void handleAddTech()}>
              Añadir
            </Button>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <h3 className="text-sm font-semibold text-slate-700">Puestos que buscas</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Los puestos y el nivel de experiencia que buscas cubrir — se usan para valorar si una oferta pide más
            experiencia de la que apuntas, y se incluyen como contexto en el prompt de "Importar con IA".
          </p>

          <div className="mt-2.5 space-y-1.5">
            {settings.soughtPositions.map((p) => (
              <div key={p.id} className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5">
                <span className="flex-1 truncate text-sm text-slate-700">{p.title}</span>
                <select
                  value={p.level}
                  onChange={(e) => void updateSoughtPosition(p.id, { level: e.target.value as ExperienceLevel })}
                  className="rounded-md border border-slate-200 bg-white px-1.5 py-1 text-xs text-slate-600 outline-none focus:border-indigo-400"
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {EXPERIENCE_LEVEL_LABELS[l]}
                    </option>
                  ))}
                </select>
                <IconButton variant="danger" label="Eliminar puesto" onClick={() => void removeSoughtPosition(p.id)}>
                  <X size={13} />
                </IconButton>
              </div>
            ))}
            {settings.soughtPositions.length === 0 && (
              <p className="text-xs italic text-slate-400">Aún no has añadido ningún puesto.</p>
            )}
          </div>

          <div className="mt-2.5 flex gap-2">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void handleAddPosition()}
              placeholder="Ej. Desarrolladora Backend"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <select
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value as ExperienceLevel)}
              className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-indigo-500"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {EXPERIENCE_LEVEL_LABELS[l]}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm" icon={<Plus size={13} />} onClick={() => void handleAddPosition()}>
              Añadir
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
