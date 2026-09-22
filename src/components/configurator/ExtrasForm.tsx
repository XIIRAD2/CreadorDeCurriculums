import type { ReactNode } from 'react'
import { Plus } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { EntryCard } from '@/components/ui/EntryCard'
import { SortableList } from '@/components/ui/SortableList'
import { TextField, TextAreaField } from '@/components/ui/Field'
import { useCvStore } from '@/store/useCvStore'

function SubSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="border-t border-slate-100 pt-5 first:border-0 first:pt-0">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      <p className="mb-3 mt-0.5 text-xs text-slate-500">{description}</p>
      {children}
    </div>
  )
}

export function ExtrasForm() {
  const projects = useCvStore((s) => s.draft?.projects)
  const certifications = useCvStore((s) => s.draft?.certifications)
  const links = useCvStore((s) => s.draft?.links)

  const addProject = useCvStore((s) => s.addProject)
  const updateProject = useCvStore((s) => s.updateProject)
  const removeProject = useCvStore((s) => s.removeProject)
  const reorderProjects = useCvStore((s) => s.reorderProjects)

  const addCertification = useCvStore((s) => s.addCertification)
  const updateCertification = useCvStore((s) => s.updateCertification)
  const removeCertification = useCvStore((s) => s.removeCertification)
  const reorderCertifications = useCvStore((s) => s.reorderCertifications)

  const addLink = useCvStore((s) => s.addLink)
  const updateLink = useCvStore((s) => s.updateLink)
  const removeLink = useCvStore((s) => s.removeLink)
  const reorderLinks = useCvStore((s) => s.reorderLinks)

  if (!projects || !certifications || !links) return null

  return (
    <div>
      <SectionHeader title="Extra" description="Proyectos, certificaciones y enlaces. Añade solo lo que aporte a la oferta." />

      <div className="space-y-6">
        <SubSection title="Proyectos" description="Proyectos personales, académicos o de código abierto.">
          <SortableList
            items={projects}
            onReorder={reorderProjects}
            className="space-y-2.5"
            renderItem={(project) => (
              <EntryCard onRemove={() => removeProject(project.id)} removeLabel="Eliminar proyecto">
                <TextField
                  value={project.name}
                  onChange={(e) => updateProject(project.id, { name: e.target.value })}
                  placeholder="Nombre del proyecto"
                />
                <TextField
                  value={project.url}
                  onChange={(e) => updateProject(project.id, { url: e.target.value })}
                  placeholder="https://github.com/usuario/proyecto"
                />
                <TextAreaField
                  value={project.description}
                  onChange={(e) => updateProject(project.id, { description: e.target.value })}
                  placeholder="Breve descripción del proyecto y tecnologías usadas"
                  rows={2}
                />
              </EntryCard>
            )}
          />
          <Button variant="outline" size="sm" icon={<Plus size={14} />} onClick={addProject} className="mt-2.5 w-full border-dashed">
            Añadir proyecto
          </Button>
        </SubSection>

        <SubSection title="Certificaciones" description="Cursos, títulos propios y certificaciones profesionales.">
          <SortableList
            items={certifications}
            onReorder={reorderCertifications}
            className="space-y-2.5"
            renderItem={(cert) => (
              <EntryCard onRemove={() => removeCertification(cert.id)} removeLabel="Eliminar certificación">
                <div className="grid grid-cols-2 gap-2">
                  <TextField
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                    placeholder="AWS Certified Developer"
                  />
                  <TextField
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                    placeholder="Amazon Web Services"
                  />
                </div>
                <TextField
                  type="month"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                  className="w-1/2"
                />
              </EntryCard>
            )}
          />
          <Button
            variant="outline"
            size="sm"
            icon={<Plus size={14} />}
            onClick={addCertification}
            className="mt-2.5 w-full border-dashed"
          >
            Añadir certificación
          </Button>
        </SubSection>

        <SubSection title="Enlaces" description="LinkedIn, portfolio, GitHub u otro enlace relevante.">
          <SortableList
            items={links}
            onReorder={reorderLinks}
            className="space-y-2.5"
            renderItem={(link) => (
              <EntryCard onRemove={() => removeLink(link.id)} removeLabel="Eliminar enlace">
                <div className="grid grid-cols-2 gap-2">
                  <TextField
                    value={link.label}
                    onChange={(e) => updateLink(link.id, { label: e.target.value })}
                    placeholder="LinkedIn"
                  />
                  <TextField
                    value={link.url}
                    onChange={(e) => updateLink(link.id, { url: e.target.value })}
                    placeholder="https://linkedin.com/in/usuario"
                  />
                </div>
              </EntryCard>
            )}
          />
          <Button variant="outline" size="sm" icon={<Plus size={14} />} onClick={addLink} className="mt-2.5 w-full border-dashed">
            Añadir enlace
          </Button>
        </SubSection>
      </div>
    </div>
  )
}
