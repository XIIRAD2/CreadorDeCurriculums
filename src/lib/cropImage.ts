import type { Area } from 'react-easy-crop'

const OUTPUT_SIZE = 480

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('No se pudo cargar la imagen'))
    img.src = src
  })
}

/** Renders the user-selected crop area (from react-easy-crop, in the source image's own
 * pixel coordinates) onto a fixed-size square canvas — this becomes the CV's stored
 * photo, already framed exactly how the user chose it, encoded as a compressed JPEG. */
export async function getCroppedImageDataUrl(src: string, area: Area, quality = 0.9): Promise<string> {
  const image = await loadImage(src)
  const canvas = document.createElement('canvas')
  canvas.width = OUTPUT_SIZE
  canvas.height = OUTPUT_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('El navegador no soporta canvas')
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE)
  return canvas.toDataURL('image/jpeg', quality)
}
