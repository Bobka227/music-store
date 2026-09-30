import type { Category } from '../types/product'

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'guitar', label: 'Kytary', icon: '🎸' },
  { id: 'bass', label: 'Baskytary', icon: '🎸' },
  { id: 'keyboard', label: 'Klávesy', icon: '🎹' },
  { id: 'drums', label: 'Bicí', icon: '🥁' },
  { id: 'accessory', label: 'Příslušenství', icon: '🎛️' },
]