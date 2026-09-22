import { Plus } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { EntryCard } from '@/components/ui/EntryCard'
import { SortableList } from '@/components/ui/SortableList'
import { useCvStore } from '@/store/useCvStore'
import { LANGUAGE_LEVELS } from '@/lib/levels'

export function LanguagesForm() {
  const languages = useCvStore((s) => s.draft?.languages)
  const addLanguage = useCvStore((s) => s.addLanguage)
  const updateLanguage = useCvStore((s) => s.updateLanguage)
  const removeLanguage = useCvStore((s) => s.removeLanguage)
  const reorderLanguages = useCvStore((s) => s.reorderLanguages)

  if (!languages) return null

  return (
    <div>
      <SectionHeader title="Idiomas" description="Idiomas que hablas y tu nivel en cada uno." />

      <SortableList
        items={languages}
        onReorder={reorderLanguages}
        className="space-y-2.5"
        renderItem={(lang) => (
          <EntryCard onRemove={() => removeLanguage(lang.id)} removeLabel="Eliminar idioma">
            <div className="grid grid-cols-2 gap-2">
              <input
                value={lang.name}
                onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
                placeholder="Inglés"
                className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <select
                value={lang.level}
                onChange={(e) => updateLanguage(lang.id, { level: e.target.value })}
                className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {LANGUAGE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </EntryCard>
        )}
      />

      <Button variant="outline" size="sm" icon={<Plus size={14} />} onClick={addLanguage} className="mt-3 w-full border-dashed">
        Añadir idioma
      </Button>
    </div>
  )
}
