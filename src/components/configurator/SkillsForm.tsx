import { Plus } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { EntryCard } from '@/components/ui/EntryCard'
import { CheckboxField } from '@/components/ui/Field'
import { SortableList } from '@/components/ui/SortableList'
import { useCvStore } from '@/store/useCvStore'
import { SKILL_LEVEL_LABELS } from '@/lib/levels'

export function SkillsForm() {
  const skills = useCvStore((s) => s.draft?.skills)
  const showSkillBar = useCvStore((s) => s.draft?.theme.showSkillBar ?? true)
  const showSkillLevel = useCvStore((s) => s.draft?.theme.showSkillLevel ?? true)
  const addSkill = useCvStore((s) => s.addSkill)
  const updateSkill = useCvStore((s) => s.updateSkill)
  const removeSkill = useCvStore((s) => s.removeSkill)
  const reorderSkills = useCvStore((s) => s.reorderSkills)
  const updateTheme = useCvStore((s) => s.updateTheme)

  if (!skills) return null

  return (
    <div>
      <SectionHeader title="Habilidades" description="Tecnologías, herramientas y competencias clave. Arrastra para reordenar." />

      <CheckboxField
        label="Mostrar la barra de nivel debajo de cada habilidad"
        checked={showSkillBar}
        onChange={(e) => updateTheme({ showSkillBar: e.target.checked })}
        className="mb-2"
      />
      <CheckboxField
        label='Mostrar el nivel en texto junto al nombre (ej. "Avanzado")'
        checked={showSkillLevel}
        onChange={(e) => updateTheme({ showSkillLevel: e.target.checked })}
        className="mb-4"
      />

      <SortableList
        items={skills}
        onReorder={reorderSkills}
        className="space-y-2.5"
        renderItem={(skill) => (
          <EntryCard onRemove={() => removeSkill(skill.id)} removeLabel="Eliminar habilidad">
            <input
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
              placeholder="React, Liderazgo de equipos, Excel avanzado…"
              className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={1}
                max={5}
                value={skill.level}
                onChange={(e) => updateSkill(skill.id, { level: Number(e.target.value) })}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600"
              />
              <span className="w-20 shrink-0 text-right text-[11px] text-slate-500">
                {SKILL_LEVEL_LABELS[skill.level]}
              </span>
            </div>
          </EntryCard>
        )}
      />

      <Button variant="outline" size="sm" icon={<Plus size={14} />} onClick={addSkill} className="mt-3 w-full border-dashed">
        Añadir habilidad
      </Button>
    </div>
  )
}
