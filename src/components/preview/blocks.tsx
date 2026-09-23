import type { ComponentType } from 'react'
import { Briefcase, GraduationCap, Sparkles, Globe, Folder, Award, Link2, User, type LucideProps } from 'lucide-react'
import type { CvDocument, CvTheme, SectionId } from '@/types/cv'
import type { Spacing } from '@/lib/themeRuntime'
import { formatRange, formatMonthYear } from '@/lib/date'
import { SKILL_LEVEL_LABELS } from '@/lib/levels'
import { TechLogo } from '@/components/ui/TechLogo'

export type Tone = 'sidebar' | 'page'

export interface BlockProps {
  cv: CvDocument
  theme: CvTheme
  spacing: Spacing
  tone: Tone
}

const SECTION_ICONS: Record<SectionId, ComponentType<LucideProps>> = {
  summary: User,
  experience: Briefcase,
  education: GraduationCap,
  skills: Sparkles,
  languages: Globe,
  projects: Folder,
  certifications: Award,
  links: Link2,
}

function SectionTitle({ icon: Icon, tone, theme, children }: { icon: ComponentType<LucideProps>; tone: Tone; theme: CvTheme; children: string }) {
  const borderColor = tone === 'sidebar' ? 'rgba(255,255,255,0.35)' : theme.accentColor
  return (
    <h3
      data-cv-chunk=""
      className="mb-2 flex items-center gap-1.5 border-b-2 pb-1 text-[11px] font-bold uppercase tracking-widest"
      style={{ borderColor, fontFamily: theme.headingFont, breakAfter: 'avoid' }}
    >
      <Icon size={12.5} strokeWidth={2.4} />
      {children}
    </h3>
  )
}

/** Renders an experience/education/project description as a plain paragraph or, when
 * `theme.descriptionStyle` is 'bullets', as one bullet per non-empty line — plain text
 * either way (real `<li>`/`<p>` elements, not an image), which is exactly what both
 * recruiters skimming and ATS keyword parsers read best. */
function DescriptionText({ text, theme, spacing, className }: { text: string; theme: CvTheme; spacing: Spacing; className: string }) {
  if (!text) return null

  if (theme.descriptionStyle !== 'bullets') {
    return (
      <p style={{ lineHeight: spacing.lineHeight, whiteSpace: 'pre-line' }} className={className}>
        {text}
      </p>
    )
  }

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length === 0) return null

  return (
    <ul style={{ lineHeight: spacing.lineHeight }} className={`${className} space-y-0.5`}>
      {lines.map((line, i) => (
        <li key={i} className="flex gap-1.5" style={{ breakInside: 'avoid' }}>
          <span aria-hidden="true" className="shrink-0">
            •
          </span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  )
}

export function SummaryBlock({ cv, theme, spacing, tone }: BlockProps) {
  return (
    <section data-cv-chunk="" style={{ marginBottom: spacing.sectionGap }}>
      <SectionTitle icon={SECTION_ICONS.summary} tone={tone} theme={theme}>
        Perfil profesional
      </SectionTitle>
      <p
        style={{ lineHeight: spacing.lineHeight, whiteSpace: 'pre-line', textAlign: 'justify' }}
        className="text-[0.95em] opacity-90"
      >
        {cv.personal.summary}
      </p>
    </section>
  )
}

export function ExperienceBlock({ cv, theme, spacing, tone }: BlockProps) {
  return (
    <section style={{ marginBottom: spacing.sectionGap }}>
      <SectionTitle icon={SECTION_ICONS.experience} tone={tone} theme={theme}>
        Experiencia laboral
      </SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.itemGap }}>
        {cv.experience.map((exp) => (
          <div key={exp.id} data-cv-chunk="" style={{ breakInside: 'avoid' }}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="font-semibold text-[1.02em]">{exp.position || 'Puesto'}</span>
              <span className="text-[0.82em] opacity-70 whitespace-nowrap">{formatRange(exp.startDate, exp.endDate, exp.current)}</span>
            </div>
            <div className="text-[0.9em] font-medium opacity-80">
              {[exp.company, exp.location].filter(Boolean).join(' · ')}
            </div>
            <DescriptionText text={exp.description} theme={theme} spacing={spacing} className="mt-1 text-[0.9em] opacity-90" />
          </div>
        ))}
      </div>
    </section>
  )
}

export function EducationBlock({ cv, theme, spacing, tone }: BlockProps) {
  return (
    <section style={{ marginBottom: spacing.sectionGap }}>
      <SectionTitle icon={SECTION_ICONS.education} tone={tone} theme={theme}>
        Educación
      </SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.itemGap }}>
        {cv.education.map((edu) => (
          <div key={edu.id} data-cv-chunk="" style={{ breakInside: 'avoid' }}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="font-semibold text-[1.02em]">{edu.degree || 'Titulación'}</span>
              <span className="text-[0.82em] opacity-70 whitespace-nowrap">{formatRange(edu.startDate, edu.endDate, edu.current)}</span>
            </div>
            <div className="text-[0.9em] font-medium opacity-80">
              {[edu.institution, edu.field, edu.location].filter(Boolean).join(' · ')}
            </div>
            <DescriptionText text={edu.description} theme={theme} spacing={spacing} className="mt-1 text-[0.9em] opacity-90" />
          </div>
        ))}
      </div>
    </section>
  )
}

export function SkillsBlock({ cv, theme, spacing, tone }: BlockProps) {
  const showBar = theme.showSkillBar !== false
  const showLevel = theme.showSkillLevel !== false
  return (
    <section style={{ marginBottom: spacing.sectionGap }}>
      <SectionTitle icon={SECTION_ICONS.skills} tone={tone} theme={theme}>
        Habilidades
      </SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.itemGap * 0.7 }}>
        {cv.skills.map((skill) => (
          <div key={skill.id} data-cv-chunk="">
            <div className={`flex items-center justify-between text-[0.88em] ${showBar ? 'mb-0.5' : ''}`}>
              <span className="flex min-w-0 items-center gap-1.5">
                <TechLogo name={skill.name} size={13} />
                <span className="truncate">{skill.name || 'Habilidad'}</span>
              </span>
              {showLevel && <span className="shrink-0 text-[0.78em] opacity-60">{SKILL_LEVEL_LABELS[skill.level]}</span>}
            </div>
            {showBar && (
              <div
                className="h-[5px] w-full overflow-hidden rounded-full"
                style={{ backgroundColor: tone === 'sidebar' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(skill.level / 5) * 100}%`,
                    backgroundColor: tone === 'sidebar' ? '#ffffff' : theme.accentColor,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export function LanguagesBlock({ cv, theme, spacing, tone }: BlockProps) {
  return (
    <section style={{ marginBottom: spacing.sectionGap }}>
      <SectionTitle icon={SECTION_ICONS.languages} tone={tone} theme={theme}>
        Idiomas
      </SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.itemGap * 0.5 }}>
        {cv.languages.map((lang) => (
          <div key={lang.id} data-cv-chunk="" className="flex items-center justify-between text-[0.9em]">
            <span>{lang.name || 'Idioma'}</span>
            <span className="opacity-70">{lang.level}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ProjectsBlock({ cv, theme, spacing, tone }: BlockProps) {
  return (
    <section style={{ marginBottom: spacing.sectionGap }}>
      <SectionTitle icon={SECTION_ICONS.projects} tone={tone} theme={theme}>
        Proyectos
      </SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.itemGap }}>
        {cv.projects.map((project) => (
          <div key={project.id} data-cv-chunk="" style={{ breakInside: 'avoid' }}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="font-semibold text-[0.95em]">{project.name || 'Proyecto'}</span>
              {project.url && <span className="text-[0.78em] opacity-60">{project.url}</span>}
            </div>
            <DescriptionText text={project.description} theme={theme} spacing={spacing} className="mt-0.5 text-[0.88em] opacity-90" />
          </div>
        ))}
      </div>
    </section>
  )
}

export function CertificationsBlock({ cv, theme, spacing, tone }: BlockProps) {
  return (
    <section style={{ marginBottom: spacing.sectionGap }}>
      <SectionTitle icon={SECTION_ICONS.certifications} tone={tone} theme={theme}>
        Certificaciones
      </SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.itemGap * 0.7 }}>
        {cv.certifications.map((cert) => (
          <div key={cert.id} data-cv-chunk="" className="text-[0.9em]" style={{ breakInside: 'avoid' }}>
            <div className="font-semibold">{cert.name || 'Certificación'}</div>
            <div className="opacity-70 text-[0.9em]">
              {[cert.issuer, formatMonthYear(cert.date)].filter(Boolean).join(' · ')}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function LinksBlock({ cv, theme, spacing, tone }: BlockProps) {
  return (
    <section style={{ marginBottom: spacing.sectionGap }}>
      <SectionTitle icon={SECTION_ICONS.links} tone={tone} theme={theme}>
        Enlaces
      </SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.itemGap * 0.5 }}>
        {cv.links.map((link) => (
          <div key={link.id} data-cv-chunk="" className="text-[0.88em]">
            <span className="font-medium">{link.label || 'Enlace'}: </span>
            <span className="opacity-75 break-all">{link.url}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

