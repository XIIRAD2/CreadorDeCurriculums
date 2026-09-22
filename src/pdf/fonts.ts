import { Font } from '@react-pdf/renderer'

// Same physical font files @fontsource ships for the live preview (index.css), but the
// plain .woff variant specifically: react-pdf embeds fonts via pdfkit/fontkit, and its
// WOFF2 glyph-subsetting encoder throws ("Offset is outside the bounds of the DataView")
// on these fonts — WOFF doesn't hit that path, and both are the same "latin" subset
// (covers Spanish accents: á é í ó ú ñ ü), so nothing is lost by picking WOFF here.
import interRegular from '@fontsource/inter/files/inter-latin-400-normal.woff?url'
import interBold from '@fontsource/inter/files/inter-latin-700-normal.woff?url'
import robotoRegular from '@fontsource/roboto/files/roboto-latin-400-normal.woff?url'
import robotoBold from '@fontsource/roboto/files/roboto-latin-700-normal.woff?url'
import latoRegular from '@fontsource/lato/files/lato-latin-400-normal.woff?url'
import latoBold from '@fontsource/lato/files/lato-latin-700-normal.woff?url'
import poppinsRegular from '@fontsource/poppins/files/poppins-latin-400-normal.woff?url'
import poppinsBold from '@fontsource/poppins/files/poppins-latin-700-normal.woff?url'
import merriweatherRegular from '@fontsource/merriweather/files/merriweather-latin-400-normal.woff?url'
import merriweatherBold from '@fontsource/merriweather/files/merriweather-latin-700-normal.woff?url'
import playfairRegular from '@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff?url'
import playfairBold from '@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff?url'
import sourceSansRegular from '@fontsource/source-sans-3/files/source-sans-3-latin-400-normal.woff?url'
import sourceSansBold from '@fontsource/source-sans-3/files/source-sans-3-latin-700-normal.woff?url'
import nunitoRegular from '@fontsource/nunito/files/nunito-latin-400-normal.woff?url'
import nunitoBold from '@fontsource/nunito/files/nunito-latin-700-normal.woff?url'

interface PdfFamily {
  name: string
  regular: string
  bold: string
}

const FAMILIES: PdfFamily[] = [
  { name: 'PDFInter', regular: interRegular, bold: interBold },
  { name: 'PDFRoboto', regular: robotoRegular, bold: robotoBold },
  { name: 'PDFLato', regular: latoRegular, bold: latoBold },
  { name: 'PDFPoppins', regular: poppinsRegular, bold: poppinsBold },
  { name: 'PDFMerriweather', regular: merriweatherRegular, bold: merriweatherBold },
  { name: 'PDFPlayfairDisplay', regular: playfairRegular, bold: playfairBold },
  { name: 'PDFSourceSans3', regular: sourceSansRegular, bold: sourceSansBold },
  { name: 'PDFNunito', regular: nunitoRegular, bold: nunitoBold },
]

/** Maps each font-pairing preset (see lib/fonts.ts) to the PDF-registered family names. */
const PDF_FONTS_BY_PAIRING: Record<string, { heading: string; body: string }> = {
  modern: { heading: 'PDFInter', body: 'PDFInter' },
  elegant: { heading: 'PDFPlayfairDisplay', body: 'PDFSourceSans3' },
  friendly: { heading: 'PDFPoppins', body: 'PDFNunito' },
  classic: { heading: 'PDFMerriweather', body: 'PDFLato' },
  neutral: { heading: 'PDFRoboto', body: 'PDFRoboto' },
  crisp: { heading: 'PDFLato', body: 'PDFSourceSans3' },
}

export function getPdfFontFamilies(fontPairingId: string): { heading: string; body: string } {
  return PDF_FONTS_BY_PAIRING[fontPairingId] ?? PDF_FONTS_BY_PAIRING.modern
}

let registered = false

/** Registers every font family with react-pdf. Idempotent and safe to call on every
 * export — must run before the first <CvPdfDocument> render. */
export function ensurePdfFontsRegistered(): void {
  if (registered) return
  for (const family of FAMILIES) {
    Font.register({
      family: family.name,
      fonts: [
        { src: family.regular, fontWeight: 400 },
        { src: family.bold, fontWeight: 700 },
      ],
    })
  }
  // The default hyphenation callback can break words oddly mid-line; keep words intact.
  Font.registerHyphenationCallback((word) => [word])
  registered = true
}
