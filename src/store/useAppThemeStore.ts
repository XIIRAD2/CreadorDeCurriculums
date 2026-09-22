import { create } from 'zustand'

export type AppThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'cv-builder:theme-mode'

function getInitialMode(): AppThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* localStorage unavailable (private mode, etc.) — fall through to system preference */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

interface AppThemeStore {
  mode: AppThemeMode
  toggle: () => void
}

/** Light/dark mode for the app's own interface (toolbar, configurator, job tracker,
 * modals) — NOT the CV document, which always renders exactly as configured in
 * "Diseño" regardless of this setting (see the `.cv-page` token re-pin in index.css).
 * Applied by toggling a `.dark` class on <html> (see App.tsx); everything else is a
 * plain CSS custom-property override, so no component needs its own dark: classes. */
export const useAppThemeStore = create<AppThemeStore>((set, get) => ({
  mode: getInitialMode(),
  toggle: () => {
    const next: AppThemeMode = get().mode === 'dark' ? 'light' : 'dark'
    set({ mode: next })
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* not fatal — just won't remember the choice next launch */
    }
  },
}))
