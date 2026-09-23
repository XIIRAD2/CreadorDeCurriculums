export interface ChunkRect {
  top: number
  bottom: number
}

/** Given the measured top/bottom of every "atomic" chunk (a section header, one entry, or
 * a whole single-chunk section like the summary) within a continuously-flowing render,
 * returns the Y-coordinates where it's safe to cut into `pageHeight`-tall pages without
 * slicing through the middle of any chunk — so an entry never appears cut across a page
 * break. Returns one Y per break (`breakpoints.length + 1` pages total); an empty array
 * means everything already fits on one page.
 *
 * When nothing fits (a single chunk taller than `pageHeight`), falls back to a hard cut
 * at the page limit — same as a real document splitting an oversized item mid-way rather
 * than leaving it off entirely. */
export function computeBreakpoints(chunks: ChunkRect[], totalHeight: number, pageHeight: number): number[] {
  if (totalHeight <= pageHeight) return []

  function isSafe(y: number): boolean {
    return !chunks.some((c) => y > c.top && y < c.bottom)
  }

  const candidates = Array.from(new Set(chunks.map((c) => c.bottom))).sort((a, b) => a - b)

  const breakpoints: number[] = []
  let pageStart = 0
  while (pageStart + pageHeight < totalHeight) {
    const limit = pageStart + pageHeight
    const safeCandidates = candidates.filter((y) => y > pageStart && y <= limit && isSafe(y))
    const chosen = safeCandidates.length > 0 ? safeCandidates[safeCandidates.length - 1] : limit
    breakpoints.push(chosen)
    pageStart = chosen
  }
  return breakpoints
}
