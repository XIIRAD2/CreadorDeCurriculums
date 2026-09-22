import { extractJsonObject, str } from '@/lib/jsonExtract'
import type { ImportedCoverLetter } from '@/lib/coverLetterImportSchema'
import type { CoverLetterContent } from '@/types/cv'

export type CoverLetterParseResult = { ok: true; data: ImportedCoverLetter } | { ok: false; error: string }

export function parseImportedCoverLetterJson(raw: string): CoverLetterParseResult {
  const trimmed = raw.trim()
  if (!trimmed) return { ok: false, error: 'Pega el JSON que te ha devuelto la IA.' }

  const extracted = extractJsonObject(trimmed)
  if (!extracted) return { ok: false, error: 'No he encontrado un objeto JSON ({ ... }) en el texto pegado.' }

  let parsed: unknown
  try {
    parsed = JSON.parse(extracted)
  } catch {
    return { ok: false, error: 'El JSON no es válido. Revisa que hayas copiado la respuesta completa, sin cortes.' }
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: 'El JSON debe ser un objeto { ... }, no una lista ni un texto suelto.' }
  }

  const data = parsed as ImportedCoverLetter
  if (!str(data.body)) {
    return { ok: false, error: 'El JSON no trae ningún texto en "body" (el cuerpo de la carta).' }
  }

  return { ok: true, data }
}

/** Normalizes into a patch for updateCoverLetter — always turns the letter on, since
 * importing content with it still off would just hide what was pasted. Never touches
 * `date` (that's today's-date-button territory, not something to ask an AI for). */
export function toCoverLetterPatch(data: ImportedCoverLetter): Partial<CoverLetterContent> {
  return {
    enabled: true,
    recipientName: str(data.recipientName),
    recipientCompany: str(data.recipientCompany),
    greeting: str(data.greeting),
    body: str(data.body),
    closing: str(data.closing) || 'Atentamente,',
  }
}
