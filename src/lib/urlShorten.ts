/** Unwraps a link that arrived as Markdown instead of a plain URL — an AI reply
 * occasionally does this (`[label](url)`, or a bare `<url>`) even when the import
 * prompt asks for a plain string. Left as-is if it's already a plain URL/string. */
export function sanitizeLink(raw: string): string {
  const value = raw.trim()
  if (!value) return ''

  const markdownLink = value.match(/^\[([^\]]*)\]\(([^)]+)\)$/)
  if (markdownLink) return markdownLink[2].trim()

  const angleAutolink = value.match(/^<(.+)>$/)
  if (angleAutolink) return angleAutolink[1].trim()

  // Leftover stray bracket/paren from a partial markdown paste (e.g. just "[https://…").
  return value.replace(/^[[(]+/, '').replace(/[\])]+$/, '').trim()
}

/** Displays a long job-posting URL as a compact "dominio/…" label while the real link
 * stays fully intact underneath — clicking it always opens the real page, this is
 * purely a display shortening, not an actual URL-shortener/redirect service. */
export function shortenUrl(url: string, maxLength = 30): string {
  if (!url) return ''
  let display = url
  try {
    const u = new URL(toHref(url))
    display = `${u.hostname}${u.pathname}${u.search}`.replace(/\/$/, '')
  } catch {
    // Not a parseable URL (partial text, missing domain…) — fall back to the raw string.
  }
  if (display.length <= maxLength) return display
  return `${display.slice(0, maxLength - 1)}…`
}

/** Best-effort href for the "open" link — sanitizes stray Markdown first (so links
 * imported before this fix still open correctly without needing to be re-edited), then
 * adds https:// when what's left is a bare domain without a protocol. */
export function toHref(url: string): string {
  const clean = sanitizeLink(url)
  if (!clean) return ''
  return /^https?:\/\//i.test(clean) ? clean : `https://${clean}`
}
