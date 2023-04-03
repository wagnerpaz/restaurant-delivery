import { PixelCrop } from 'react-image-crop'
import { canvasPreview } from './canvasPreview'

// Returns an image source you should set to state and pass
// `{previewSrc && <img alt="Crop preview" src={previewSrc} />}`
export async function imgPreview(
   image: HTMLImageElement,
   crop: PixelCrop,
   scale = 1,
   rotate = 0
) {
   const canvas = document.createElement('canvas')
   canvasPreview(image, canvas, crop, scale, rotate)
   return canvas.toDataURL()
}
