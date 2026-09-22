import { isTauri } from '@tauri-apps/api/core'

/** Opens a URL in the system's default browser.
 *
 * Inside the desktop app, Tauri's webview blocks plain `target="_blank"` navigation to
 * external sites by default (a security default, not a bug) — clicking such a link just
 * does nothing. So there, this hands the URL to the OS via Tauri's official opener
 * plugin instead. In a normal web browser (the `npm run dev`/deployed web app) Tauri
 * isn't present at all, so it falls back to a plain `window.open`.
 *
 * The opener plugin is imported dynamically so the plain web build never pulls its code
 * (and never touches an API that doesn't exist there) in the first place. */
export async function openExternalUrl(url: string): Promise<void> {
  if (!url) return
  if (isTauri()) {
    const { openUrl } = await import('@tauri-apps/plugin-opener')
    await openUrl(url)
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}
