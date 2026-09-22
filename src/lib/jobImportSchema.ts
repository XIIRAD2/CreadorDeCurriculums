import { EXPERIENCE_LEVEL_LABELS } from '@/types/settings'
import type { SoughtPosition } from '@/types/settings'

/** Shape of the JSON an external AI is asked to return for the job-tracker import —
 * mirrors the CV import in lib/importSchema.ts, but for one or more job offers at once. */
export interface ImportedJobApplication {
  company?: string
  offer?: string
  link?: string
  technologies?: string[]
  experienceYears?: number | string
  location?: string
  workMode?: string
  applicantCount?: number | string
  publishedDate?: string
}

export interface ImportedJobData {
  applications?: ImportedJobApplication[]
}

const SCHEMA_EXAMPLE = `{
  "applications": [
    {
      "company": "string — nombre de la empresa",
      "offer": "string — nombre/título de la oferta",
      "link": "string — URL completa de la oferta",
      "technologies": ["string", "..."],
      "experienceYears": "número entero — años mínimos de experiencia que pide la oferta, vacío si no lo especifica",
      "location": "string — ciudad y provincia/región, ej. 'Valencia, Comunidad Valenciana', vacío si no aparece",
      "workMode": "'onsite', 'remote' o 'hybrid' según sea presencial, remoto o híbrido — vacío si no lo dice",
      "applicantCount": "número entero — cuánta gente ha aplicado ya, si la propia oferta lo muestra (ej. LinkedIn a veces pone 'más de 200 solicitudes'), vacío si no aparece",
      "publishedDate": "YYYY-MM-DD — fecha de publicación de la oferta, vacío si no aparece"
    }
  ]
}`

/** The prompt is a function (not a constant) so it can fold in the positions from "Mi
 * perfil de búsqueda" — with that context, the AI can flag a mismatched level/title
 * instead of blindly extracting fields. Called with no positions (or none configured
 * yet), it's the exact same prompt as before. */
export function buildJobImportPrompt(soughtPositions: SoughtPosition[] = []): string {
  const positionsBlock =
    soughtPositions.length > 0
      ? `\n\nEstoy buscando concretamente estos puestos — tenlo en cuenta al valorar si una oferta encaja bien conmigo:\n${soughtPositions
          .map((p) => `- ${p.title} (nivel ${EXPERIENCE_LEVEL_LABELS[p.level]})`)
          .join('\n')}\n`
      : ''

  return `Actúa como un asistente que organiza ofertas de trabajo. Te voy a pegar una o varias ofertas de empleo (pueden ser enlaces, texto copiado de una web de empleo, o una lista con varias ofertas juntas). Tu tarea es devolver ÚNICAMENTE un objeto JSON válido con este esquema exacto (mismos nombres de campo, misma estructura anidada; los valores del ejemplo son descripciones de lo que debe ir en cada campo, no los copies literalmente):

${SCHEMA_EXAMPLE}

Reglas importantes:
- Responde SOLO con el JSON. Sin explicaciones, sin bloques de código markdown, sin texto antes ni después.
- Un elemento del array "applications" por cada oferta distinta que te pase.
- Usa el formato "YYYY-MM-DD" en "publishedDate". Si no la sabes, déjala como cadena vacía "".
- "technologies" es una lista corta de las tecnologías/palabras clave técnicas que pide la oferta (ej. ["React", "Node.js", "SQL"]). Si no hay ninguna clara, deja el array vacío.
- "experienceYears" es solo el número mínimo de años (ej. si pide "3-5 años" pon 3; si pone "más de 2 años" pon 2). Si la oferta no menciona experiencia, déjalo como cadena vacía "".
- "workMode" debe ser exactamente una de estas tres palabras en inglés: "onsite" (presencial), "remote" (remoto) o "hybrid" (híbrido). Si la oferta no lo especifica, déjalo como cadena vacía "".
- "applicantCount" es solo el número (ej. si pone "más de 200 solicitudes" pon 200). Si no aparece ese dato, déjalo como cadena vacía "".
- Si no tienes información para un campo, déjalo como cadena vacía "". No inventes datos que no te haya dado.
- No añadas campos que no estén en el esquema anterior.${positionsBlock}
Aquí están las ofertas:
[[ PEGA AQUÍ LOS ENLACES O EL TEXTO DE LAS OFERTAS DE HOY ]]`
}
