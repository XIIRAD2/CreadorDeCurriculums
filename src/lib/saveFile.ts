import { isTauri } from '@tauri-apps/api/core'

interface SaveFileOptions {
  filename: string
  blob: Blob
  /** Shown as the file-type filter label in the native "Guardar como" dialog (Tauri only). */
  filterName: string
  extensions: string[]
}

/** Saves a Blob to disk — the shared plumbing behind every "download" button in the app
 * (PDF export, JSON export).
 *
 * Inside the desktop app, Tauri's webview silently swallows a plain `<a download>`
 * click — the exact same class of restriction that blocks `target="_blank"` navigation
 * (see openExternal.ts) — so nothing happens and it just looks broken. There, this opens
 * a native "Guardar como" dialog and writes the bytes for real. In a normal web browser
 * (`npm run dev` / the deployed web app) Tauri isn't present, so it falls back to the
 * standard Blob + `<a download>` trick, which works fine there.
 *
 * Both Tauri plugins are imported dynamically so the plain web build never pulls their
 * code (or touches an API that doesn't exist there) in the first place. */
export async function saveFile({ filename, blob, filterName, extensions }: SaveFileOptions): Promise<void> {
  if (isTauri()) {
    const [{ save }, { writeFile }] = await Promise.all([import('@tauri-apps/plugin-dialog'), import('@tauri-apps/plugin-fs')])
    const path = await save({ defaultPath: filename, filters: [{ name: filterName, extensions }] })
    if (!path) return // user cancelled the dialog
    const bytes = new Uint8Array(await blob.arrayBuffer())
    await writeFile(path, bytes)
    return
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
