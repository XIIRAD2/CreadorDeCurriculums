/** Finds the first balanced `{ ... }` object in the text, tracking string/escape state
 * so braces inside quoted strings don't throw off the count. Handles both a clean JSON
 * reply and one wrapped in a ```json fence or surrounded by "here's your JSON:" prose.
 * Shared by every "paste what the AI gave you" importer (CV data, job offers…). */
export function extractJsonObject(text: string): string | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = fenced ? fenced[1] : text
  const start = candidate.indexOf('{')
  if (start === -1) return null

  let depth = 0
  let inString = false
  let escapeNext = false
  for (let i = start; i < candidate.length; i++) {
    const char = candidate[i]
    if (escapeNext) {
      escapeNext = false
      continue
    }
    if (char === '\\') {
      escapeNext = true
      continue
    }
    if (char === '"') {
      inString = !inString
      continue
    }
    if (inString) continue
    if (char === '{') depth++
    else if (char === '}') {
      depth--
      if (depth === 0) return candidate.slice(start, i + 1)
    }
  }
  return null
}

export function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback
}
