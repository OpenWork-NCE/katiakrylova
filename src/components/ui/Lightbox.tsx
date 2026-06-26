'use client'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

type Slide = { src: string; alt?: string; width?: number; height?: number }

export function ImageLightbox({ open, onClose, slides, index = 0 }: {
  open: boolean
  onClose: () => void
  slides: Slide[]
  index?: number
}) {
  return <Lightbox open={open} close={onClose} index={index} slides={slides} />
}