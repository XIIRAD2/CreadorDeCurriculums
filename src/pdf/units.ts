/** react-pdf lays out in points (72/inch); every size in the rest of the app (spacing,
 * the density presets, the 794×1123 A4-at-96dpi page) is tuned in CSS pixels (96/inch).
 * This keeps the exported PDF's proportions matching the live preview instead of
 * printing everything ~33% larger. */
const PX_TO_PT = 72 / 96

export function pt(px: number): number {
  return px * PX_TO_PT
}

/** The live preview's base font size is `14 * theme.fontScale` CSS px, with every text
 * role sized as a Tailwind `text-[NNem]` relative to that (see blocks.tsx / templates).
 * This is the PDF equivalent: pass the exact same em multiplier used in the HTML class
 * so every text role stays pixel-for-pixel proportional between preview and export. */
export function em(multiplier: number, fontScale: number): number {
  return pt(14 * multiplier * fontScale)
}
