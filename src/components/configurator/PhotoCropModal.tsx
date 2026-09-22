import { useCallback, useState } from 'react'
import Cropper, { type Area, type Point } from 'react-easy-crop'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { getCroppedImageDataUrl } from '@/lib/cropImage'

interface PhotoCropModalProps {
  open: boolean
  imageSrc: string | null
  /** Only 'circle' gets a round crop guide — 'rounded' and 'square' both use a plain
   * square guide, since the corner-rounding itself is applied at render time, not baked
   * into the stored photo. */
  round: boolean
  onCancel: () => void
  onConfirm: (dataUrl: string) => void
}

const INITIAL_CROP: Point = { x: 0, y: 0 }

export function PhotoCropModal({ open, imageSrc, round, onCancel, onConfirm }: PhotoCropModalProps) {
  const [crop, setCrop] = useState<Point>(INITIAL_CROP)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  function reset() {
    setCrop(INITIAL_CROP)
    setZoom(1)
    setCroppedAreaPixels(null)
    setError(null)
    setSaving(false)
  }

  function handleClose() {
    reset()
    onCancel()
  }

  async function handleConfirm() {
    if (!imageSrc || !croppedAreaPixels) return
    setSaving(true)
    setError(null)
    try {
      const dataUrl = await getCroppedImageDataUrl(imageSrc, croppedAreaPixels)
      onConfirm(dataUrl)
      reset()
    } catch {
      setError('No se pudo procesar la imagen. Inténtalo de nuevo.')
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open && Boolean(imageSrc)}
      onClose={handleClose}
      title="Ajustar foto"
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={() => void handleConfirm()} disabled={saving || !croppedAreaPixels}>
            {saving ? 'Guardando…' : 'Guardar foto'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="relative h-80 w-full overflow-hidden rounded-xl bg-slate-900">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape={round ? 'round' : 'rect'}
              showGrid={!round}
              minZoom={1}
              maxZoom={4}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <ZoomOut size={16} className="shrink-0 text-slate-400" />
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600"
          />
          <ZoomIn size={16} className="shrink-0 text-slate-400" />
        </div>

        <p className="text-center text-xs text-slate-400">Arrastra la imagen para moverla y usa el deslizador para hacer zoom.</p>

        {error && <p className="text-center text-xs text-rose-500">{error}</p>}
      </div>
    </Modal>
  )
}
