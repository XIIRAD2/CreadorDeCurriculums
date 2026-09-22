import { SectionHeader } from '@/components/ui/SectionHeader'
import { TextField, TextAreaField } from '@/components/ui/Field'
import { PhotoUploader } from '@/components/configurator/PhotoUploader'
import { useCvStore } from '@/store/useCvStore'

export function PersonalInfoForm() {
  const personal = useCvStore((s) => s.draft?.personal)
  const updatePersonal = useCvStore((s) => s.updatePersonal)

  if (!personal) return null

  return (
    <div>
      <SectionHeader
        title="Datos personales"
        description="La información de contacto que aparecerá en la cabecera del CV."
      />

      <div className="space-y-4">
        <PhotoUploader />

        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Nombre"
            required
            value={personal.firstName}
            onChange={(e) => updatePersonal({ firstName: e.target.value })}
            placeholder="Laura"
          />
          <TextField
            label="Apellidos"
            required
            value={personal.lastName}
            onChange={(e) => updatePersonal({ lastName: e.target.value })}
            placeholder="Gómez Ruiz"
          />
        </div>

        <TextField
          label="Puesto / titular profesional"
          hint="Se muestra bajo tu nombre"
          value={personal.title}
          onChange={(e) => updatePersonal({ title: e.target.value })}
          placeholder="Desarrolladora Frontend"
        />

        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="Correo electrónico"
            type="email"
            value={personal.email}
            onChange={(e) => updatePersonal({ email: e.target.value })}
            placeholder="laura@gmail.com"
          />
          <TextField
            label="Teléfono"
            type="tel"
            value={personal.phone}
            onChange={(e) => updatePersonal({ phone: e.target.value })}
            placeholder="+34 600 000 000"
          />
        </div>

        <TextField
          label="Ubicación"
          value={personal.location}
          onChange={(e) => updatePersonal({ location: e.target.value })}
          placeholder="Madrid, España"
        />

        <TextAreaField
          label="Perfil profesional"
          hint={`${personal.summary.length}/600`}
          value={personal.summary}
          maxLength={600}
          onChange={(e) => updatePersonal({ summary: e.target.value })}
          placeholder="Breve resumen de tu experiencia, tus puntos fuertes y lo que buscas. Adáptalo a cada oferta."
          rows={5}
        />
      </div>
    </div>
  )
}
