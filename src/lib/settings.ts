import { db } from '@/db/db'
import { genId } from '@/lib/id'
import { DEFAULT_APP_SETTINGS } from '@/types/settings'
import { TOP_TECHNOLOGIES } from '@/lib/techLogos'
import type { AppSettings, SoughtPosition, ExperienceLevel } from '@/types/settings'

const SETTINGS_ID = 'default'

export async function getAppSettings(): Promise<AppSettings> {
  const existing = await db.settings.get(SETTINGS_ID)
  return existing ?? DEFAULT_APP_SETTINGS
}

export async function updateAppSettings(patch: Partial<Omit<AppSettings, 'id'>>): Promise<void> {
  const current = await getAppSettings()
  await db.settings.put({ ...current, ...patch, id: SETTINGS_ID })
}

export async function addSoughtPosition(title: string, level: ExperienceLevel): Promise<void> {
  const current = await getAppSettings()
  const position: SoughtPosition = { id: genId(), title, level }
  await updateAppSettings({ soughtPositions: [...current.soughtPositions, position] })
}

export async function updateSoughtPosition(id: string, patch: Partial<Omit<SoughtPosition, 'id'>>): Promise<void> {
  const current = await getAppSettings()
  await updateAppSettings({
    soughtPositions: current.soughtPositions.map((p) => (p.id === id ? { ...p, ...patch } : p)),
  })
}

export async function removeSoughtPosition(id: string): Promise<void> {
  const current = await getAppSettings()
  await updateAppSettings({ soughtPositions: current.soughtPositions.filter((p) => p.id !== id) })
}

export async function toggleBaseTechnology(name: string): Promise<void> {
  const current = await getAppSettings()
  const has = current.baseTechnologies.some((t) => t.toLowerCase() === name.toLowerCase())
  const next = has
    ? current.baseTechnologies.filter((t) => t.toLowerCase() !== name.toLowerCase())
    : [...current.baseTechnologies, name]
  await updateAppSettings({ baseTechnologies: next })
}

export async function addBaseTechnology(name: string): Promise<void> {
  const trimmed = name.trim()
  if (!trimmed) return
  const current = await getAppSettings()
  if (current.baseTechnologies.some((t) => t.toLowerCase() === trimmed.toLowerCase())) return
  await updateAppSettings({ baseTechnologies: [...current.baseTechnologies, trimmed] })
}

/** The 40 most-used technologies (lib/techLogos.ts) — "pick the ones that apply" tags
 * for "Mi perfil de búsqueda" rather than free-typing a list from scratch. Selecting one
 * that's already in `baseTechnologies` is a no-op via toggleBaseTechnology, and anything
 * not in this list can still be added by hand. */
export const SUGGESTED_BASE_TECHNOLOGIES: string[] = [...TOP_TECHNOLOGIES]
