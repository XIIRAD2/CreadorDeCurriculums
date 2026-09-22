import { create } from 'zustand'

export type AppView = 'cv' | 'tracker'

interface ViewStore {
  view: AppView
  setView: (view: AppView) => void
}

/** Which top-level screen is showing: the CV editor (configurator + live A4 preview)
 * or the job-application tracker grid. Kept as its own tiny store instead of local
 * React state in App.tsx so other components — e.g. "open the CV linked to this
 * offer" from inside the tracker — can switch screens without prop-drilling a setter. */
export const useViewStore = create<ViewStore>((set) => ({
  view: 'cv',
  setView: (view) => set({ view }),
}))
