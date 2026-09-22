import { Document, Page } from '@react-pdf/renderer'
import type { ComponentType } from 'react'
import type { CvDocument as CvData, TemplateId } from '@/types/cv'
import { getPdfFontFamilies } from '@/pdf/fonts'
import { SidebarPdfTemplate } from '@/pdf/SidebarPdfTemplate'
import { MinimalPdfTemplate } from '@/pdf/MinimalPdfTemplate'
import { TwoColumnPdfTemplate } from '@/pdf/TwoColumnPdfTemplate'
import { ElegantPdfTemplate } from '@/pdf/ElegantPdfTemplate'
import { CompactAtsPdfTemplate } from '@/pdf/CompactAtsPdfTemplate'

const TEMPLATE_COMPONENTS: Record<TemplateId, ComponentType<{ cv: CvData }>> = {
  sidebar: SidebarPdfTemplate,
  minimal: MinimalPdfTemplate,
  'two-column': TwoColumnPdfTemplate,
  elegant: ElegantPdfTemplate,
  'compact-ats': CompactAtsPdfTemplate,
}

export function CvPdfDocument({ cv }: { cv: CvData }) {
  const fonts = getPdfFontFamilies(cv.theme.fontPairingId)
  const Template = TEMPLATE_COMPONENTS[cv.theme.templateId] ?? SidebarPdfTemplate
  const title = `${cv.personal.firstName} ${cv.personal.lastName}`.trim() || cv.name

  return (
    <Document title={title} author={title}>
      <Page size="A4" style={{ fontFamily: fonts.body }} wrap>
        <Template cv={cv} />
      </Page>
    </Document>
  )
}
