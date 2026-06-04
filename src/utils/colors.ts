import type { ColorEntry } from '../types/color'
import { shuffle } from '../utils'

export async function loadColors(): Promise<ColorEntry[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}colors.json`)
  if (!response.ok) {
    throw new Error('Could not load colors.')
  }
  return response.json() as Promise<ColorEntry[]>
}

export function shuffleColors(colors: ColorEntry[]): ColorEntry[] {
  return shuffle(colors)
}

/** Light colors need a visible border in the UI. */
export function isLightSwatch(hex: string): boolean {
  const normalized = hex.replace('#', '')
  if (normalized.length !== 6) return false
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.85
}
