import { Document, Page } from '@react-pdf/renderer'
import type { CvDocument as CvData } from '@/types/cv'
import { getPdfFontFamilies } from '@/pdf/fonts'
import { CoverLetterPdfTemplate } from '@/pdf/CoverLetterPdfTemplate'

export function CoverLetterPdfDocument({ cv }: { cv: CvData }) {
  const fonts = getPdfFontFamilies(cv.theme.fontPairingId)
  const fullName = `${cv.personal.firstName} ${cv.personal.lastName}`.trim()
  const title = fullName ? `Carta de presentación — ${fullName}` : 'Carta de presentación'

  return (
    <Document title={title} author={fullName || cv.name}>
      <Page size="A4" style={{ fontFamily: fonts.body }} wrap>
        <CoverLetterPdfTemplate cv={cv} />
      </Page>
    </Document>
  )
}
