import { create } from 'zustand'
import { db, LAST_ACTIVE_KEY } from '@/db/db'
import { genId } from '@/lib/id'
import { createEmptyCv, cloneCv, DEFAULT_COVER_LETTER } from '@/lib/defaultData'
import { findPalette } from '@/lib/palettes'
import { findFontPairing } from '@/lib/fonts'
import { buildImportedDocument, type ImportCounts } from '@/lib/importCv'
import type { ImportedCvData } from '@/lib/importSchema'
import type { CvConfigJson } from '@/lib/cvConfig'
import type {
  CvDocument,
  PersonalInfo,
  Skill,
  Language,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  CertificationEntry,
  LinkEntry,
  CvTheme,
  SectionId,
  CoverLetterContent,
} from '@/types/cv'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
type ListKey = 'skills' | 'languages' | 'education' | 'experience' | 'projects' | 'certifications' | 'links'

interface CvStore {
  draft: CvDocument | null
  saveStatus: SaveStatus
  lastSavedAt: number | null
  ready: boolean

  ensureActiveCv: () => Promise<void>
  loadCv: (id: string) => Promise<void>
  createCv: (name?: string) => Promise<string>
  duplicateCv: (id: string, name: string) => Promise<string>
  deleteCv: (id: string) => Promise<void>
  renameCv: (name: string) => void
  setTargetCompany: (value: string) => void
  saveNow: () => Promise<void>
  applyImport: (data: ImportedCvData) => ImportCounts
  applyConfig: (config: CvConfigJson) => void

  updatePersonal: (patch: Partial<PersonalInfo>) => void
  updateCoverLetter: (patch: Partial<CoverLetterContent>) => void
  updateTheme: (patch: Partial<CvTheme>) => void
  applyPalette: (paletteId: string) => void
  applyFontPairing: (fontPairingId: string) => void
  reorderSections: (order: SectionId[]) => void
  toggleSectionVisibility: (id: SectionId) => void

  addSkill: () => void
  updateSkill: (id: string, patch: Partial<Skill>) => void
  removeSkill: (id: string) => void
  reorderSkills: (ids: string[]) => void

  addLanguage: () => void
  updateLanguage: (id: string, patch: Partial<Language>) => void
  removeLanguage: (id: string) => void
  reorderLanguages: (ids: string[]) => void

  addEducation: () => void
  updateEducation: (id: string, patch: Partial<EducationEntry>) => void
  removeEducation: (id: string) => void
  reorderEducation: (ids: string[]) => void

  addExperience: () => void
  updateExperience: (id: string, patch: Partial<ExperienceEntry>) => void
  removeExperience: (id: string) => void
  reorderExperience: (ids: string[]) => void

  addProject: () => void
  updateProject: (id: string, patch: Partial<ProjectEntry>) => void
  removeProject: (id: string) => void
  reorderProjects: (ids: string[]) => void

  addCertification: () => void
  updateCertification: (id: string, patch: Partial<CertificationEntry>) => void
  removeCertification: (id: string) => void
  reorderCertifications: (ids: string[]) => void

  addLink: () => void
  updateLink: (id: string, patch: Partial<LinkEntry>) => void
  removeLink: (id: string) => void
  reorderLinks: (ids: string[]) => void
}

let persistTimer: ReturnType<typeof setTimeout> | null = null
let inFlightEnsureActiveCv: Promise<void> | null = null
const AUTOSAVE_DELAY_MS = 600

async function persistDraft(get: () => CvStore, set: (p: Partial<CvStore>) => void) {
  const draft = get().draft
  if (!draft) return
  try {
    await db.cvs.put(draft)
    set({ saveStatus: 'saved', lastSavedAt: Date.now() })
  } catch (err) {
    console.error('No se pudo guardar el CV en la base de datos local', err)
    set({ saveStatus: 'error' })
  }
}

function scheduleAutosave(get: () => CvStore, set: (p: Partial<CvStore>) => void) {
  set({ saveStatus: 'saving' })
  if (persistTimer) clearTimeout(persistTimer)
  persistTimer = setTimeout(() => {
    void persistDraft(get, set)
  }, AUTOSAVE_DELAY_MS)
}

function withList<T extends { id: string }>(draft: CvDocument, key: ListKey, list: T[]): CvDocument {
  return { ...draft, [key]: list } as CvDocument
}

function rememberActiveId(id: string) {
  try {
    localStorage.setItem(LAST_ACTIVE_KEY, id)
  } catch {
    /* localStorage unavailable (private mode, etc.) — not fatal, just skip persistence of "last active" */
  }
}

export const useCvStore = create<CvStore>((set, get) => {
  function commit(next: CvDocument) {
    set({ draft: { ...next, updatedAt: Date.now() } })
    scheduleAutosave(get, set)
  }

  function currentDraftOrThrow(): CvDocument {
    const draft = get().draft
    if (!draft) throw new Error('No hay ningún CV activo')
    return draft
  }

  function listActions<T extends { id: string }>(key: ListKey, factory: () => T) {
    function currentList(draft: CvDocument): T[] {
      return draft[key] as unknown as T[]
    }

    return {
      add: () => {
        const draft = currentDraftOrThrow()
        commit(withList(draft, key, [...currentList(draft), factory()]))
      },
      update: (id: string, patch: Partial<T>) => {
        const draft = currentDraftOrThrow()
        const list = currentList(draft).map((item) => (item.id === id ? { ...item, ...patch } : item))
        commit(withList(draft, key, list))
      },
      remove: (id: string) => {
        const draft = currentDraftOrThrow()
        const list = currentList(draft).filter((item) => item.id !== id)
        commit(withList(draft, key, list))
      },
      reorder: (ids: string[]) => {
        const draft = currentDraftOrThrow()
        const byId = new Map(currentList(draft).map((item) => [item.id, item]))
        const list = ids.map((id) => byId.get(id)).filter((item): item is T => Boolean(item))
        commit(withList(draft, key, list))
      },
    }
  }

  const skillActions = listActions<Skill>('skills', () => ({ id: genId(), name: '', level: 3 }))
  const languageActions = listActions<Language>('languages', () => ({ id: genId(), name: '', level: 'Intermedio (B1)' }))
  const educationActions = listActions<EducationEntry>('education', () => ({
    id: genId(),
    institution: '',
    degree: '',
    field: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  }))
  const experienceActions = listActions<ExperienceEntry>('experience', () => ({
    id: genId(),
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  }))
  const projectActions = listActions<ProjectEntry>('projects', () => ({ id: genId(), name: '', description: '', url: '' }))
  const certificationActions = listActions<CertificationEntry>('certifications', () => ({
    id: genId(),
    name: '',
    issuer: '',
    date: '',
  }))
  const linkActions = listActions<LinkEntry>('links', () => ({ id: genId(), label: '', url: '' }))

  return {
    draft: null,
    saveStatus: 'idle',
    lastSavedAt: null,
    ready: false,

    ensureActiveCv: async () => {
      if (get().ready) return
      // Guards against React StrictMode's dev-time double-invoked effect (and any other
      // accidental concurrent call): the promise below is assigned synchronously, before
      // any `await`, so a second call arriving in the same tick reuses it instead of
      // racing its own read-then-create and creating a duplicate empty CV.
      if (inFlightEnsureActiveCv) {
        await inFlightEnsureActiveCv
        return
      }
      inFlightEnsureActiveCv = (async () => {
        let lastId: string | null = null
        try {
          lastId = localStorage.getItem(LAST_ACTIVE_KEY)
        } catch {
          lastId = null
        }

        let doc: CvDocument | undefined
        if (lastId) doc = await db.cvs.get(lastId)
        if (!doc) doc = await db.cvs.orderBy('updatedAt').last()
        if (!doc) {
          doc = createEmptyCv()
          await db.cvs.add(doc)
        }

        rememberActiveId(doc.id)
        set({ draft: doc, ready: true, saveStatus: 'saved', lastSavedAt: doc.updatedAt })
      })()
      try {
        await inFlightEnsureActiveCv
      } finally {
        inFlightEnsureActiveCv = null
      }
    },

    loadCv: async (id) => {
      if (persistTimer) clearTimeout(persistTimer)
      await persistDraft(get, set)
      const doc = await db.cvs.get(id)
      if (!doc) return
      rememberActiveId(doc.id)
      set({ draft: doc, saveStatus: 'saved', lastSavedAt: doc.updatedAt })
    },

    createCv: async (name = 'Nuevo currículum') => {
      const doc = createEmptyCv(name)
      await db.cvs.add(doc)
      rememberActiveId(doc.id)
      set({ draft: doc, saveStatus: 'saved', lastSavedAt: doc.updatedAt })
      return doc.id
    },

    duplicateCv: async (id, name) => {
      const current = get().draft
      const source = current?.id === id ? current : await db.cvs.get(id)
      if (!source) throw new Error('CV no encontrado')
      const clone = cloneCv(source, name)
      await db.cvs.add(clone)
      rememberActiveId(clone.id)
      set({ draft: clone, saveStatus: 'saved', lastSavedAt: clone.updatedAt })
      return clone.id
    },

    deleteCv: async (id) => {
      await db.cvs.delete(id)
      if (get().draft?.id !== id) return
      const remaining = await db.cvs.orderBy('updatedAt').last()
      if (remaining) {
        rememberActiveId(remaining.id)
        set({ draft: remaining, saveStatus: 'saved', lastSavedAt: remaining.updatedAt })
      } else {
        const doc = createEmptyCv()
        await db.cvs.add(doc)
        rememberActiveId(doc.id)
        set({ draft: doc, saveStatus: 'saved', lastSavedAt: doc.updatedAt })
      }
    },

    renameCv: (name) => commit({ ...currentDraftOrThrow(), name }),
    setTargetCompany: (value) => commit({ ...currentDraftOrThrow(), targetCompany: value }),

    saveNow: async () => {
      if (persistTimer) {
        clearTimeout(persistTimer)
        persistTimer = null
      }
      await persistDraft(get, set)
    },

    applyImport: (data) => {
      const draft = currentDraftOrThrow()
      const { document, counts } = buildImportedDocument(draft, data)
      commit(document)
      return counts
    },

    applyConfig: (config) => {
      const draft = currentDraftOrThrow()
      commit({ ...draft, theme: config.theme, sectionOrder: config.sectionOrder, hiddenSections: config.hiddenSections })
    },

    updatePersonal: (patch) => {
      const draft = currentDraftOrThrow()
      commit({ ...draft, personal: { ...draft.personal, ...patch } })
    },

    updateCoverLetter: (patch) => {
      const draft = currentDraftOrThrow()
      commit({ ...draft, coverLetter: { ...(draft.coverLetter ?? DEFAULT_COVER_LETTER), ...patch } })
    },

    updateTheme: (patch) => {
      const draft = currentDraftOrThrow()
      commit({ ...draft, theme: { ...draft.theme, ...patch } })
    },

    applyPalette: (paletteId) => {
      const palette = findPalette(paletteId)
      const draft = currentDraftOrThrow()
      commit({
        ...draft,
        theme: { ...draft.theme, paletteId, primaryColor: palette.primary, accentColor: palette.accent, textColor: palette.text },
      })
    },

    applyFontPairing: (fontPairingId) => {
      const pairing = findFontPairing(fontPairingId)
      const draft = currentDraftOrThrow()
      commit({
        ...draft,
        theme: { ...draft.theme, fontPairingId, headingFont: pairing.heading, bodyFont: pairing.body },
      })
    },

    reorderSections: (order) => commit({ ...currentDraftOrThrow(), sectionOrder: order }),

    toggleSectionVisibility: (id) => {
      const draft = currentDraftOrThrow()
      const hidden = draft.hiddenSections.includes(id)
        ? draft.hiddenSections.filter((s) => s !== id)
        : [...draft.hiddenSections, id]
      commit({ ...draft, hiddenSections: hidden })
    },

    addSkill: skillActions.add,
    updateSkill: skillActions.update,
    removeSkill: skillActions.remove,
    reorderSkills: skillActions.reorder,

    addLanguage: languageActions.add,
    updateLanguage: languageActions.update,
    removeLanguage: languageActions.remove,
    reorderLanguages: languageActions.reorder,

    addEducation: educationActions.add,
    updateEducation: educationActions.update,
    removeEducation: educationActions.remove,
    reorderEducation: educationActions.reorder,

    addExperience: experienceActions.add,
    updateExperience: experienceActions.update,
    removeExperience: experienceActions.remove,
    reorderExperience: experienceActions.reorder,

    addProject: projectActions.add,
    updateProject: projectActions.update,
    removeProject: projectActions.remove,
    reorderProjects: projectActions.reorder,

    addCertification: certificationActions.add,
    updateCertification: certificationActions.update,
    removeCertification: certificationActions.remove,
    reorderCertifications: certificationActions.reorder,

    addLink: linkActions.add,
    updateLink: linkActions.update,
    removeLink: linkActions.remove,
    reorderLinks: linkActions.reorder,
  }
})
