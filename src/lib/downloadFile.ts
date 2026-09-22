import { saveFile } from '@/lib/saveFile'

/** Downloads `data` as a pretty-printed JSON file — a native "Guardar como" dialog in
 * the desktop app, a normal browser download on the web (see saveFile.ts for why the
 * two need different mechanisms). */
export async function downloadJsonFile(filename: string, data: unknown): Promise<void> {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  await saveFile({ filename, blob, filterName: 'JSON', extensions: ['json'] })
}

/** Reads a File (e.g. from an <input type="file"> picker) as text — used to load a
 * previously-exported JSON file back in without asking the user to copy/paste it. */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer el archivo'))
    reader.readAsText(file)
  })
}
