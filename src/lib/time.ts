const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })

export function formatRelativeTime(timestamp: number): string {
  const diffMin = Math.round((timestamp - Date.now()) / 60000)
  if (Math.abs(diffMin) < 1) return 'ahora mismo'
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute')
  const diffHour = Math.round(diffMin / 60)
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour')
  const diffDay = Math.round(diffHour / 24)
  return rtf.format(diffDay, 'day')
}
