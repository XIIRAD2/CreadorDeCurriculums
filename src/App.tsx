import { useEffect } from 'react'
import { useCvStore } from '@/store/useCvStore'
import { useViewStore } from '@/store/useViewStore'
import { useAppThemeStore } from '@/store/useAppThemeStore'
import { TopBar } from '@/components/layout/TopBar'
import { Configurator } from '@/components/layout/Configurator'
import { PreviewPanel } from '@/components/preview/PreviewPanel'
import { JobTrackerPage } from '@/components/jobTracker/JobTrackerPage'

export default function App() {
  const draft = useCvStore((s) => s.draft)
  const ensureActiveCv = useCvStore((s) => s.ensureActiveCv)
  const view = useViewStore((s) => s.view)
  const themeMode = useAppThemeStore((s) => s.mode)

  useEffect(() => {
    void ensureActiveCv()
  }, [ensureActiveCv])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark')
  }, [themeMode])

  if (!draft) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500" />
          <span className="text-sm">Cargando tu currículum…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      <TopBar />
      {view === 'tracker' ? (
        <JobTrackerPage />
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
          <div className="h-[42%] shrink-0 overflow-hidden border-b border-slate-200 md:h-auto md:w-[420px] md:border-b-0 md:border-r lg:w-[460px]">
            <Configurator />
          </div>
          <div className="flex-1 overflow-hidden">
            <PreviewPanel cv={draft} />
          </div>
        </div>
      )}
    </div>
  )
}
