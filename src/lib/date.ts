/** Formats an <input type="month"> value ("YYYY-MM") into a short Spanish label ("Ene 2022"). */
export function formatMonthYear(value: string): string {
  if (!value) return ''
  const [year, month] = value.split('-').map(Number)
  if (!year || !month) return value
  const date = new Date(year, month - 1, 1)
  const formatted = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
  const clean = formatted.replace('.', '')
  return clean.charAt(0).toUpperCase() + clean.slice(1)
}

/** Formats an <input type="date"> value ("YYYY-MM-DD") into a full Spanish date label
 * ("3 de septiembre de 2026"), e.g. for the cover letter's dateline. */
export function formatFullDate(value: string): string {
  if (!value) return ''
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return value
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatRange(start: string, end: string, current: boolean): string {
  const startLabel = formatMonthYear(start)
  const endLabel = current ? 'Actualidad' : formatMonthYear(end)
  if (!startLabel && !endLabel) return ''
  if (!startLabel) return endLabel
  if (!endLabel) return startLabel
  return `${startLabel} — ${endLabel}`
}
