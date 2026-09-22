import { Mail, Phone, MapPin } from 'lucide-react'
import type { PersonalInfo } from '@/types/cv'

interface ContactInfoProps {
  personal: PersonalInfo
  layout?: 'stacked' | 'inline'
}

export function ContactInfo({ personal, layout = 'stacked' }: ContactInfoProps) {
  const fields = [
    { Icon: Mail, value: personal.email, placeholder: 'correo@ejemplo.com' },
    { Icon: Phone, value: personal.phone, placeholder: '+34 600 000 000' },
    { Icon: MapPin, value: personal.location, placeholder: 'Ciudad, País' },
  ]

  return (
    <div className={layout === 'stacked' ? 'space-y-1.5' : 'flex flex-wrap gap-x-4 gap-y-1'}>
      {fields.map(({ Icon, value, placeholder }, i) => (
        <div key={i} className="flex items-center gap-1.5 text-[0.85em]">
          <Icon size={12} className="shrink-0 opacity-70" />
          <span className={value ? 'break-all opacity-90' : 'italic opacity-40'}>{value || placeholder}</span>
        </div>
      ))}
    </div>
  )
}
