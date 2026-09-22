import { useState } from 'react'
import { User, Briefcase, GraduationCap, Sparkles, Globe, Folder, Palette, Mail } from 'lucide-react'
import { PersonalInfoForm } from '@/components/configurator/PersonalInfoForm'
import { ExperienceForm } from '@/components/configurator/ExperienceForm'
import { EducationForm } from '@/components/configurator/EducationForm'
import { SkillsForm } from '@/components/configurator/SkillsForm'
import { LanguagesForm } from '@/components/configurator/LanguagesForm'
import { ExtrasForm } from '@/components/configurator/ExtrasForm'
import { CoverLetterForm } from '@/components/configurator/CoverLetterForm'
import { DesignForm } from '@/components/configurator/DesignForm'

const TABS = [
  { id: 'personal', label: 'Personal', icon: User, Component: PersonalInfoForm },
  { id: 'experience', label: 'Experiencia', icon: Briefcase, Component: ExperienceForm },
  { id: 'education', label: 'Educación', icon: GraduationCap, Component: EducationForm },
  { id: 'skills', label: 'Habilidades', icon: Sparkles, Component: SkillsForm },
  { id: 'languages', label: 'Idiomas', icon: Globe, Component: LanguagesForm },
  { id: 'extras', label: 'Extra', icon: Folder, Component: ExtrasForm },
  { id: 'letter', label: 'Carta', icon: Mail, Component: CoverLetterForm },
  { id: 'design', label: 'Diseño', icon: Palette, Component: DesignForm },
] as const

type TabId = (typeof TABS)[number]['id']

export function Configurator() {
  const [active, setActive] = useState<TabId>('personal')
  const ActiveForm = TABS.find((t) => t.id === active)?.Component ?? PersonalInfoForm

  return (
    <div className="flex h-full">
      <nav className="flex w-16 shrink-0 flex-col items-center gap-1 overflow-y-auto border-r border-slate-200 bg-white py-3 sm:w-[72px]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={`flex w-14 flex-col items-center gap-1 rounded-lg py-2 text-[10px] font-medium leading-tight transition sm:w-16 ${
              active === tab.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="thin-scrollbar flex-1 overflow-y-auto p-5">
        <ActiveForm />
      </div>
    </div>
  )
}
