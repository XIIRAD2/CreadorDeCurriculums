import { useRef, useState } from 'react'
import { User, Crop } from 'lucide-react'
import { Button, IconButton } from '@/components/ui/Button'
import { PhotoCropModal } from '@/components/configurator/PhotoCropModal'
import { resizeImageFile } from '@/lib/image'
import { useCvStore } from '@/store/useCvStore'

/** Cap for the image handed to the crop editor — generous enough to look sharp while
 * zoomed in, small enough to keep the cropper snappy on a big phone-camera photo. The
 * final saved photo is a separate, smaller square rendered from the chosen crop area. */
const EDITOR_MAX_DIM = 1600

export function PhotoUploader() {
  const photo = useCvStore((s) => s.draft?.personal.photo ?? null)
  const photoShape = useCvStore((s) => s.draft?.theme.photoShape ?? 'circle')
  const updatePersonal = useCvStore((s) => s.updatePersonal)
  const [error, setError] = useState<string | null>(null)
  const [editingSrc, setEditingSrc] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Selecciona un archivo de imagen (JPG, PNG…)')
      return
    }
    try {
      const dataUrl = await resizeImageFile(file, EDITOR_MAX_DIM, 0.92)
      setError(null)
      setEditingSrc(dataUrl)
    } catch {
      setError('No se pudo procesar la imagen. Prueba con otro archivo.')
    }
  }

  return (
    <div>
      <span className="mb-1 block text-xs font-medium text-slate-600">Foto de perfil</span>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-slate-400">
          {photo ? (
            <img src={photo} alt="Foto de perfil" className="h-full w-full object-cover" />
          ) : (
            <User size={22} />
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
              {photo ? 'Cambiar foto' : 'Subir foto'}
            </Button>
            {photo && (
              <IconButton label="Ajustar recorte" onClick={() => setEditingSrc(photo)}>
                <Crop size={14} />
              </IconButton>
            )}
            {photo && (
              <Button type="button" variant="ghost" size="sm" onClick={() => updatePersonal({ photo: null })}>
                Quitar
              </Button>
            )}
          </div>
          <span className="text-[11px] text-slate-400">JPG o PNG. Podrás recortarla y hacer zoom.</span>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}

      <PhotoCropModal
        open={editingSrc !== null}
        imageSrc={editingSrc}
        round={photoShape === 'circle'}
        onCancel={() => setEditingSrc(null)}
        onConfirm={(dataUrl) => {
          updatePersonal({ photo: dataUrl })
          setEditingSrc(null)
        }}
      />
    </div>
  )
}
