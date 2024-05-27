import type { BlockType } from '../types'

export const currentVersion = 8

export const blockTypes: Record<BlockType, string> = {
  announcements: 'Annonces',
  openDoors: 'Portes Ouvertes',
  reading: 'Lecture',
  recitation: 'Récitation',
  section: 'Section',
  sermon: 'Prédication',
  songs: 'Chants',
}

export const slideshowEnabled: boolean
  = 'VITE_SLIDESHOW_ENABLED' in import.meta.env
  && import.meta.env.VITE_SLIDESHOW_ENABLED !== 'false'
