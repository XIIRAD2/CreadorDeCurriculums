/** Shape of the JSON an external AI is asked to return for the cover letter — same
 * "copy prompt, paste JSON" mechanism as the CV and job-tracker importers, but here the
 * AI is drafting the letter itself from what you tell it about you and the job, not just
 * reshaping information you already typed. */
export interface ImportedCoverLetter {
  recipientName?: string
  recipientCompany?: string
  greeting?: string
  body?: string
  closing?: string
}

const SCHEMA_EXAMPLE = `{
  "recipientName": "string — a quién se dirige, ej. 'Equipo de Recursos Humanos' o un nombre si lo tienes, vacío si no lo sabes",
  "recipientCompany": "string — nombre de la empresa a la que aplicas",
  "greeting": "string — saludo formal, ej. 'Estimado equipo de selección,'",
  "body": "string — el cuerpo de la carta, 2 a 4 párrafos separados por una línea en blanco",
  "closing": "string — despedida formal, ej. 'Atentamente,'"
}`

export const COVER_LETTER_IMPORT_PROMPT = `Actúa como un asistente que escribe cartas de presentación para ofertas de trabajo. Te voy a pegar dos cosas: (1) información sobre mi perfil profesional (mi CV, mi experiencia, o simplemente unas notas), y (2) la oferta de trabajo a la que quiero presentarme (el puesto, la empresa, y qué piden). Con eso, redacta una carta de presentación profesional y personalizada, y devuelve ÚNICAMENTE un objeto JSON válido con este esquema exacto (mismos nombres de campo; los valores del ejemplo son descripciones de lo que debe ir en cada campo, no los copies literalmente):

${SCHEMA_EXAMPLE}

Reglas importantes:
- Responde SOLO con el JSON. Sin explicaciones, sin bloques de código markdown, sin texto antes ni después.
- El cuerpo ("body") debe conectar mi experiencia real (la que te doy) con lo que pide la oferta — nada genérico ni relleno, y sin inventar datos, títulos o logros que no te haya dado.
- Tono profesional, concreto y natural — como lo escribiría una persona, no una plantilla.
- Escribe todo en español.
- No añadas campos que no estén en el esquema anterior. No incluyas la fecha ni mi nombre al final — eso ya lo pone la app automáticamente.

Aquí está mi información y la oferta:
[[ PEGA AQUÍ TU CV/EXPERIENCIA Y, DEBAJO, LA OFERTA DE TRABAJO A LA QUE APLICAS ]]`
