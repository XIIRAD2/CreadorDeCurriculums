import { Plus } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { EntryCard } from '@/components/ui/EntryCard'
import { SortableList } from '@/components/ui/SortableList'
import { TextField, TextAreaField, CheckboxField } from '@/components/ui/Field'
import { useCvStore } from '@/store/useCvStore'

export function EducationForm() {
  const education = useCvStore((s) => s.draft?.education)
  const addEducation = useCvStore((s) => s.addEducation)
  const updateEducation = useCvStore((s) => s.updateEducation)
  const removeEducation = useCvStore((s) => s.removeEducation)
  const reorderEducation = useCvStore((s) => s.reorderEducation)

  if (!education) return null

  return (
    <div>
      <SectionHeader title="Educación" description="Titulaciones, cursos y formación académica." />

      <SortableList
        items={education}
        onReorder={reorderEducation}
        className="space-y-3"
        renderItem={(edu) => (
          <EntryCard onRemove={() => removeEducation(edu.id)} removeLabel="Eliminar formación">
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Título / titulación"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                placeholder="Grado en Ingeniería Informática"
              />
              <TextField
                label="Centro"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                placeholder="Universidad Complutense de Madrid"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Especialidad"
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                placeholder="Ingeniería del Software"
              />
              <TextField
                label="Ubicación"
                value={edu.location}
                onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                placeholder="Madrid, España"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <TextField
                label="Inicio"
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
              />
              <TextField
                label="Fin"
                type="month"
                value={edu.endDate}
                disabled={edu.current}
                onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
              />
            </div>
            <CheckboxField
              label="En curso actualmente"
              checked={edu.current}
              onChange={(e) => updateEducation(edu.id, { current: e.target.checked, endDate: e.target.checked ? '' : edu.endDate })}
            />
            <TextAreaField
              label="Descripción"
              hint="Opcional"
              value={edu.description}
              onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
              placeholder="Menciones, proyecto final, matrícula de honor…"
              rows={2}
            />
          </EntryCard>
        )}
      />

      <Button variant="outline" size="sm" icon={<Plus size={14} />} onClick={addEducation} className="mt-3 w-full border-dashed">
        Añadir formación
      </Button>
    </div>
  )
}
