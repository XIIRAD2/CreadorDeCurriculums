import { View, Text } from '@react-pdf/renderer'
import type { CvDocument, CvTheme } from '@/types/cv'
import type { Spacing } from '@/lib/themeRuntime'
import { withAlpha } from '@/lib/color'
import { formatRange, formatMonthYear } from '@/lib/date'
import { SKILL_LEVEL_LABELS } from '@/lib/levels'
import { PdfSectionTitle } from '@/pdf/PdfSectionTitle'
import { DescriptionTextPdf } from '@/pdf/DescriptionTextPdf'
import { TechLogoPdf } from '@/pdf/TechLogoPdf'
import { pt, em } from '@/pdf/units'

/** Every block below mirrors its blocks.tsx (HTML) counterpart value-for-value — same
 * `em()` multipliers, same `spacing` (density) numbers, same opacity-as-alpha blends —
 * so the exported PDF matches whatever the live preview shows, at any density/font-scale. */
export interface BlockPdfProps {
  cv: CvDocument
  theme: CvTheme
  spacing: Spacing
  tone: 'sidebar' | 'page'
  fonts: { heading: string; body: string }
  textColor: string
}

export function SummaryBlockPdf({ cv, theme, spacing, tone, fonts, textColor }: BlockPdfProps) {
  return (
    <View style={{ marginBottom: pt(spacing.sectionGap) }}>
      <PdfSectionTitle theme={theme} tone={tone} fontFamily={fonts.heading} sectionId="summary" color={textColor}>
        Perfil profesional
      </PdfSectionTitle>
      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: em(0.95, theme.fontScale),
          lineHeight: spacing.lineHeight,
          color: withAlpha(textColor, 0.9),
          textAlign: 'justify',
        }}
      >
        {cv.personal.summary}
      </Text>
    </View>
  )
}

export function ExperienceBlockPdf({ cv, theme, spacing, tone, fonts, textColor }: BlockPdfProps) {
  return (
    <View style={{ marginBottom: pt(spacing.sectionGap) }}>
      <PdfSectionTitle theme={theme} tone={tone} fontFamily={fonts.heading} sectionId="experience" color={textColor}>
        Experiencia laboral
      </PdfSectionTitle>
      {cv.experience.map((exp, i) => (
        <View key={exp.id} wrap={false} style={{ marginTop: i === 0 ? 0 : pt(spacing.itemGap) }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', columnGap: pt(12) }}>
            <Text style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: em(1.02, theme.fontScale), color: textColor }}>
              {exp.position || 'Puesto'}
            </Text>
            <Text style={{ fontFamily: fonts.body, fontSize: em(0.82, theme.fontScale), color: withAlpha(textColor, 0.7) }}>
              {formatRange(exp.startDate, exp.endDate, exp.current)}
            </Text>
          </View>
          <Text style={{ fontFamily: fonts.body, fontSize: em(0.9, theme.fontScale), color: withAlpha(textColor, 0.8) }}>
            {[exp.company, exp.location].filter(Boolean).join(' · ')}
          </Text>
          <DescriptionTextPdf
            text={exp.description}
            theme={theme}
            spacing={spacing}
            fontFamily={fonts.body}
            fontSize={em(0.9, theme.fontScale)}
            color={withAlpha(textColor, 0.9)}
            marginTop={pt(4)}
          />
        </View>
      ))}
    </View>
  )
}

export function EducationBlockPdf({ cv, theme, spacing, tone, fonts, textColor }: BlockPdfProps) {
  return (
    <View style={{ marginBottom: pt(spacing.sectionGap) }}>
      <PdfSectionTitle theme={theme} tone={tone} fontFamily={fonts.heading} sectionId="education" color={textColor}>
        Educación
      </PdfSectionTitle>
      {cv.education.map((edu, i) => (
        <View key={edu.id} wrap={false} style={{ marginTop: i === 0 ? 0 : pt(spacing.itemGap) }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', columnGap: pt(12) }}>
            <Text style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: em(1.02, theme.fontScale), color: textColor }}>
              {edu.degree || 'Titulación'}
            </Text>
            <Text style={{ fontFamily: fonts.body, fontSize: em(0.82, theme.fontScale), color: withAlpha(textColor, 0.7) }}>
              {formatRange(edu.startDate, edu.endDate, edu.current)}
            </Text>
          </View>
          <Text style={{ fontFamily: fonts.body, fontSize: em(0.9, theme.fontScale), color: withAlpha(textColor, 0.8) }}>
            {[edu.institution, edu.field, edu.location].filter(Boolean).join(' · ')}
          </Text>
          <DescriptionTextPdf
            text={edu.description}
            theme={theme}
            spacing={spacing}
            fontFamily={fonts.body}
            fontSize={em(0.9, theme.fontScale)}
            color={withAlpha(textColor, 0.9)}
            marginTop={pt(4)}
          />
        </View>
      ))}
    </View>
  )
}

export function SkillsBlockPdf({ cv, theme, spacing, tone, fonts, textColor }: BlockPdfProps) {
  const showBar = theme.showSkillBar !== false
  const showLevel = theme.showSkillLevel !== false
  const barTrack = tone === 'sidebar' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)'
  const barFill = tone === 'sidebar' ? '#ffffff' : theme.accentColor

  return (
    <View style={{ marginBottom: pt(spacing.sectionGap) }}>
      <PdfSectionTitle theme={theme} tone={tone} fontFamily={fonts.heading} sectionId="skills" color={textColor}>
        Habilidades
      </PdfSectionTitle>
      {cv.skills.map((skill, i) => (
        <View key={skill.id} wrap={false} style={{ marginTop: i === 0 ? 0 : pt(spacing.itemGap * 0.7) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: showBar ? pt(2) : 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: pt(4) }}>
              <TechLogoPdf name={skill.name} size={pt(9)} />
              <Text style={{ fontFamily: fonts.body, fontSize: em(0.88, theme.fontScale), color: textColor }}>
                {skill.name || 'Habilidad'}
              </Text>
            </View>
            {showLevel && (
              <Text style={{ fontFamily: fonts.body, fontSize: em(0.78, theme.fontScale), color: withAlpha(textColor, 0.6) }}>
                {SKILL_LEVEL_LABELS[skill.level]}
              </Text>
            )}
          </View>
          {showBar && (
            <View style={{ height: pt(5), borderRadius: pt(2.5), backgroundColor: barTrack }}>
              <View
                style={{
                  height: pt(5),
                  borderRadius: pt(2.5),
                  width: `${(skill.level / 5) * 100}%`,
                  backgroundColor: barFill,
                }}
              />
            </View>
          )}
        </View>
      ))}
    </View>
  )
}

export function LanguagesBlockPdf({ cv, theme, spacing, tone, fonts, textColor }: BlockPdfProps) {
  return (
    <View style={{ marginBottom: pt(spacing.sectionGap) }}>
      <PdfSectionTitle theme={theme} tone={tone} fontFamily={fonts.heading} sectionId="languages" color={textColor}>
        Idiomas
      </PdfSectionTitle>
      {cv.languages.map((lang, i) => (
        <View
          key={lang.id}
          wrap={false}
          style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: i === 0 ? 0 : pt(spacing.itemGap * 0.5) }}
        >
          <Text style={{ fontFamily: fonts.body, fontSize: em(0.9, theme.fontScale), color: textColor }}>{lang.name || 'Idioma'}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: em(0.9, theme.fontScale), color: withAlpha(textColor, 0.7) }}>
            {lang.level}
          </Text>
        </View>
      ))}
    </View>
  )
}

export function ProjectsBlockPdf({ cv, theme, spacing, tone, fonts, textColor }: BlockPdfProps) {
  return (
    <View style={{ marginBottom: pt(spacing.sectionGap) }}>
      <PdfSectionTitle theme={theme} tone={tone} fontFamily={fonts.heading} sectionId="projects" color={textColor}>
        Proyectos
      </PdfSectionTitle>
      {cv.projects.map((project, i) => (
        <View key={project.id} wrap={false} style={{ marginTop: i === 0 ? 0 : pt(spacing.itemGap) }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', columnGap: pt(12) }}>
            <Text style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: em(0.95, theme.fontScale), color: textColor }}>
              {project.name || 'Proyecto'}
            </Text>
            {project.url && (
              <Text style={{ fontFamily: fonts.body, fontSize: em(0.78, theme.fontScale), color: withAlpha(textColor, 0.6) }}>
                {project.url}
              </Text>
            )}
          </View>
          <DescriptionTextPdf
            text={project.description}
            theme={theme}
            spacing={spacing}
            fontFamily={fonts.body}
            fontSize={em(0.88, theme.fontScale)}
            color={withAlpha(textColor, 0.9)}
            marginTop={pt(2)}
          />
        </View>
      ))}
    </View>
  )
}

export function CertificationsBlockPdf({ cv, theme, spacing, tone, fonts, textColor }: BlockPdfProps) {
  return (
    <View style={{ marginBottom: pt(spacing.sectionGap) }}>
      <PdfSectionTitle theme={theme} tone={tone} fontFamily={fonts.heading} sectionId="certifications" color={textColor}>
        Certificaciones
      </PdfSectionTitle>
      {cv.certifications.map((cert, i) => (
        <View key={cert.id} wrap={false} style={{ marginTop: i === 0 ? 0 : pt(spacing.itemGap * 0.7) }}>
          <Text style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: em(0.9, theme.fontScale), color: textColor }}>
            {cert.name || 'Certificación'}
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: em(0.9, theme.fontScale), color: withAlpha(textColor, 0.7) }}>
            {[cert.issuer, formatMonthYear(cert.date)].filter(Boolean).join(' · ')}
          </Text>
        </View>
      ))}
    </View>
  )
}

export function LinksBlockPdf({ cv, theme, spacing, tone, fonts, textColor }: BlockPdfProps) {
  return (
    <View style={{ marginBottom: pt(spacing.sectionGap) }}>
      <PdfSectionTitle theme={theme} tone={tone} fontFamily={fonts.heading} sectionId="links" color={textColor}>
        Enlaces
      </PdfSectionTitle>
      {cv.links.map((link, i) => (
        <Text
          key={link.id}
          wrap={false}
          style={{
            fontFamily: fonts.body,
            fontSize: em(0.88, theme.fontScale),
            color: withAlpha(textColor, 0.75),
            marginTop: i === 0 ? 0 : pt(spacing.itemGap * 0.5),
          }}
        >
          <Text style={{ color: textColor }}>{link.label || 'Enlace'}</Text>: {link.url}
        </Text>
      ))}
    </View>
  )
}
