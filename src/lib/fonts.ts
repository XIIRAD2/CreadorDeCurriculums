import type { FontPairing } from '@/types/cv'

/** Font pairings, all self-hosted via @fontsource (see index.css) so the live preview,
 * the exported PDF and offline use always render identically — no Google Fonts CDN call. */
export const FONT_PAIRINGS: FontPairing[] = [
  { id: 'modern', label: 'Moderna', heading: '"Inter", sans-serif', body: '"Inter", sans-serif' },
  { id: 'elegant', label: 'Elegante', heading: '"Playfair Display", serif', body: '"Source Sans 3", sans-serif' },
  { id: 'friendly', label: 'Cercana', heading: '"Poppins", sans-serif', body: '"Nunito", sans-serif' },
  { id: 'classic', label: 'Clásica', heading: '"Merriweather", serif', body: '"Lato", sans-serif' },
  { id: 'neutral', label: 'Neutra', heading: '"Roboto", sans-serif', body: '"Roboto", sans-serif' },
  { id: 'crisp', label: 'Nítida', heading: '"Lato", sans-serif', body: '"Source Sans 3", sans-serif' },
]

export const DEFAULT_FONT_PAIRING = FONT_PAIRINGS[0]

export function findFontPairing(id: string): FontPairing {
  return FONT_PAIRINGS.find((f) => f.id === id) ?? DEFAULT_FONT_PAIRING
}
