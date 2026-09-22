import type { ReactElement } from 'react'
import type { DocumentProps } from '@react-pdf/renderer'
import type { CvDocument } from '@/types/cv'
import { saveFile } from '@/lib/saveFile'

async function downloadPdf(element: ReactElement<DocumentProps>, fileNameWithoutExtension: string): Promise<void> {
  const [{ pdf }, { ensurePdfFontsRegistered }] = await Promise.all([import('@react-pdf/renderer'), import('@/pdf/fonts')])

  ensurePdfFontsRegistered()

  const blob = await pdf(element).toBlob()
  await saveFile({ filename: `${fileNameWithoutExtension}.pdf`, blob, filterName: 'PDF', extensions: ['pdf'] })
}

/** Generates the CV as a real PDF — genuine embedded text via @react-pdf/renderer, not
 * a screenshot of the page — and saves it directly (no print dialog involved). The PDF
 * engine (~600KB) is dynamically imported so it never loads until the user actually
 * exports. */
export async function exportCvPdf(cv: CvDocument, fileNameWithoutExtension: string): Promise<void> {
  const { CvPdfDocument } = await import('@/pdf/CvPdfDocument')
  await downloadPdf(<CvPdfDocument cv={cv} />, fileNameWithoutExtension)
}

/** Same mechanism as exportCvPdf, for the paired cover letter. */
export async function exportCoverLetterPdf(cv: CvDocument, fileNameWithoutExtension: string): Promise<void> {
  const { CoverLetterPdfDocument } = await import('@/pdf/CoverLetterPdfDocument')
  await downloadPdf(<CoverLetterPdfDocument cv={cv} />, fileNameWithoutExtension)
}
