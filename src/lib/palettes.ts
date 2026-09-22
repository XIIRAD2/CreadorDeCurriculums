export interface ColorPalette {
  id: string
  label: string
  primary: string
  accent: string
  text: string
}

/** Curated, print-friendly color tables. `primary` drives headings/sidebar/accent bar,
 * `accent` is used for tags, bullets and highlights, `text` is the body copy color. */
export const COLOR_PALETTES: ColorPalette[] = [
  { id: 'navy', label: 'Azul marino', primary: '#1e3a5f', accent: '#2f6fed', text: '#1f2937' },
  { id: 'slate', label: 'Grafito', primary: '#1f2937', accent: '#334155', text: '#1f2937' },
  { id: 'emerald', label: 'Esmeralda', primary: '#065f46', accent: '#10b981', text: '#1f2937' },
  { id: 'burgundy', label: 'Burdeos', primary: '#7c2d3e', accent: '#b91c4a', text: '#1f2937' },
  { id: 'teal', label: 'Turquesa', primary: '#0f766e', accent: '#14b8a6', text: '#1f2937' },
  { id: 'plum', label: 'Ciruela', primary: '#4c1d95', accent: '#7c3aed', text: '#1f2937' },
  { id: 'terracotta', label: 'Terracota', primary: '#9a3412', accent: '#ea580c', text: '#1f2937' },
  { id: 'charcoal-gold', label: 'Carbón y oro', primary: '#111827', accent: '#b45309', text: '#1f2937' },
  { id: 'ocean', label: 'Océano', primary: '#0c4a6e', accent: '#0ea5e9', text: '#1f2937' },
  { id: 'rose', label: 'Rosa vino', primary: '#831843', accent: '#db2777', text: '#1f2937' },
]

export const DEFAULT_PALETTE = COLOR_PALETTES[0]

export function findPalette(id: string): ColorPalette {
  return COLOR_PALETTES.find((p) => p.id === id) ?? DEFAULT_PALETTE
}
