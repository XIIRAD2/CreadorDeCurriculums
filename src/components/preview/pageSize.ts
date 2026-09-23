/** Shared A4-at-96dpi page geometry for the live HTML preview — width/height match
 * `.cv-page` in index.css, and the gap matches CvPreview.tsx's `gap-6` — kept in one
 * place so CvPreview.tsx, PreviewPanel.tsx and usePagination.ts can't drift apart. */
export const PAGE_WIDTH_PX = 794
export const PAGE_HEIGHT_PX = 1123
export const PAGE_GAP_PX = 24
