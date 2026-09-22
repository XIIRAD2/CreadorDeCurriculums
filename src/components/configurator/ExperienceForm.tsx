import { Plus } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { EntryCard } from '@/components/ui/EntryCard'
import { SortableList } from '@/components/ui/SortableList'
import { TextField, TextAreaField, CheckboxField } from '@/components/ui/Field'
import { useCvStore } from '@/store/useCvStore'

export function ExperienceForm() {
  const experience = useCvStore((s) => s.draft?.experience)
  const addExperience = useCvStore((s) => s.addExperience)
  const updateExperience = useCvStore((s) => s.updateExperience)
  const removeExperience = useCvStore((s) => s.removeExperience)
  const reorderExperience = useCvStore((s) => s.reorderExperience)

  if (!experience) return null

  return (
    <div>
      <SectionHeader title="Experiencia laboral" description="Tus puestos anteriores, del más al menos reciente." />

      <SortableList
        items={experience}
        onReorder={reorderExperience}
        className="space-y-3"
        renderItem={(exp) => (
          <EntryCard onRemove={() => removeExperience(exp.id)} removeLabel="Eliminar experiencia">
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Puesto"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                placeholder="Desarrolladora Frontend"
              />
              <TextField
                label="Empresa"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                placeholder="Acme Corp"
              />
            </div>
            <TextField
              label="Ubicación"
              value={exp.location}
              onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
              placeholder="Remoto / Madrid, España"
            />
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Inicio"
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
              />
              <TextField
                label="Fin"
                type="month"
                value={exp.endDate}
                disabled={exp.current}
                onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
              />
            </div>
            <CheckboxField
              label="Trabajo actual"
              checked={exp.current}
              onChange={(e) => updateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })}
            />
            <TextAreaField
              label="Descripción"
              hint="Responsabilidades y logros. Adapta esto a cada oferta."
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
              placeholder={'Lideré el rediseño de… \nAumenté un 30% el rendimiento de…'}
              rows={3}
            />
          </EntryCard>
        )}
      />

      <Button variant="outline" size="sm" icon={<Plus size={14} />} onClick={addExperience} className="mt-3 w-full border-dashed">
        Añadir experiencia
      </Button>
    </div>
  )
}
