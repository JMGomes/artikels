import type { Word } from './types'

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function pickRandomWords(allWords: Word[], count: number): Word[] {
  return shuffle(allWords).slice(0, Math.min(count, allWords.length))
}

export async function loadWords(): Promise<Word[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}words.json`)
  if (!response.ok) {
    throw new Error('Could not load vocabulary.')
  }
  return response.json() as Promise<Word[]>
}
