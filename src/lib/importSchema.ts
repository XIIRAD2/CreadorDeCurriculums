/** Shape of the JSON an external AI (ChatGPT, Claude, Gemini…) is asked to return.
 * Every field is optional/loose on purpose — the merge logic in importCv.ts normalizes
 * and validates whatever actually arrives instead of trusting the AI followed it exactly. */
export interface ImportedCvData {
  personal?: {
    firstName?: string
    lastName?: string
    title?: string
    email?: string
    phone?: string
    location?: string
    summary?: string
  }
  skills?: Array<{ name?: string; level?: number | string }>
  languages?: Array<{ name?: string; level?: string }>
  education?: Array<{
    institution?: string
    degree?: string
    field?: string
    location?: string
    startDate?: string
    endDate?: string
    current?: boolean
    description?: string
  }>
  experience?: Array<{
    company?: string
    position?: string
    location?: string
    startDate?: string
    endDate?: string
    current?: boolean
    description?: string
  }>
  projects?: Array<{ name?: string; description?: string; url?: string }>
  certifications?: Array<{ name?: string; issuer?: string; date?: string }>
  links?: Array<{ label?: string; url?: string }>
}

/** The exact shape shown to the AI inside the prompt — kept as a literal JSON string
 * (not JSON.stringify of a TS object) so the field-by-field comments stay readable. */
const SCHEMA_EXAMPLE = `{
  "personal": {
    "firstName": "string",
    "lastName": "string",
    "title": "string — puesto o titular profesional, ej. 'Desarrolladora Frontend'",
    "email": "string",
    "phone": "string",
    "location": "string — ciudad, país",
    "summary": "string — resumen profesional de 2 a 4 frases"
  },
  "skills": [
    { "name": "string", "level": "número entero de 1 a 5 (1=básico, 5=experto)" }
  ],
  "languages": [
    { "name": "string, ej. Inglés", "level": "string, ej. 'C1 · Avanzado' o 'Nativo'" }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string — título obtenido",
      "field": "string — especialidad (opcional)",
      "location": "string (opcional)",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM — vacío si current es true",
      "current": "boolean",
      "description": "string (opcional)"
    }
  ],
  "experience": [
    {
      "company": "string",
      "position": "string",
      "location": "string (opcional)",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM — vacío si current es true",
      "current": "boolean",
      "description": "string — logros y responsabilidades, puedes separar líneas con \\n"
    }
  ],
  "projects": [
    { "name": "string", "description": "string", "url": "string (opcional)" }
  ],
  "certifications": [
    { "name": "string", "issuer": "string (opcional)", "date": "YYYY-MM (opcional)" }
  ],
  "links": [
    { "label": "string, ej. LinkedIn, GitHub, Portfolio", "url": "string" }
  ]
}`

export const AI_IMPORT_PROMPT = `Actúa como un asistente que rellena currículums. Te voy a pegar información sobre mi perfil profesional (puede ser un CV en texto, mi perfil de LinkedIn, notas sueltas, o simplemente una lista de trabajos y tecnologías). Tu tarea es devolver ÚNICAMENTE un objeto JSON válido con este esquema exacto (mismos nombres de campo, misma estructura anidada; los valores del ejemplo son descripciones de lo que debe ir en cada campo, no los copies literalmente):

${SCHEMA_EXAMPLE}

Reglas importantes:
- Responde SOLO con el JSON. Sin explicaciones, sin bloques de código markdown, sin texto antes ni después.
- Usa el formato "YYYY-MM" en todas las fechas (ej. "2022-09"). Si no sabes el mes exacto, usa "01".
- "level" en "skills" debe ser un número entero del 1 al 5.
- Si no tienes información para un campo, déjalo como cadena vacía "" o quita ese elemento del array. No inventes datos que no te haya dado.
- Escribe el contenido en español, con tono profesional y conciso.
- No añadas campos que no estén en el esquema anterior.
- No incluyas el correo ni el teléfono dentro de "links" — esos van solo en "personal.email" y "personal.phone". "links" es solo para LinkedIn, GitHub, portfolio, etc.

Aquí está mi información:
[[ PEGA AQUÍ TU CV ACTUAL, TU LINKEDIN, O UNAS NOTAS SOBRE TU EXPERIENCIA ]]`
