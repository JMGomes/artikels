import type { ConjugationRound, PronounKey, VerbEntry } from '../types/verb'
import { shuffle } from '../utils'

export const PRONOUN_ORDER: PronounKey[] = [
  'ich',
  'du',
  'er',
  'sie',
  'es',
  'wir',
  'ihr',
  'sie_plural',
  'Sie',
]

export const PRONOUN_LABELS: Record<PronounKey, string> = {
  ich: 'ich',
  du: 'du',
  er: 'er',
  sie: 'sie',
  es: 'es',
  wir: 'wir',
  ihr: 'ihr',
  sie_plural: 'sie (they)',
  Sie: 'Sie (formal)',
}

export async function loadVerbs(): Promise<VerbEntry[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}verbs.json`)
  if (!response.ok) {
    throw new Error('Could not load verbs.')
  }
  return response.json() as Promise<VerbEntry[]>
}

export function normalizeConjugationAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function gradeConjugation(expected: string, userAnswer: string): boolean {
  return normalizeConjugationAnswer(expected) === normalizeConjugationAnswer(userAnswer)
}

export function pickSessionVerbs(verbs: VerbEntry[], count: number): VerbEntry[] {
  return shuffle(verbs).slice(0, Math.min(count, verbs.length))
}

export function pickTwoPronouns(verb: VerbEntry): PronounKey[] {
  const available = PRONOUN_ORDER.filter((key) => verb.present[key]?.trim())
  return shuffle(available).slice(0, 2)
}

export function buildSessionRounds(verbs: VerbEntry[], roundCount: number): ConjugationRound[] {
  const selected = pickSessionVerbs(verbs, roundCount)
  return selected.map((verb) => ({
    verb,
    pronouns: pickTwoPronouns(verb),
    results: [],
  }))
}

export function getConjugationForm(verb: VerbEntry, pronoun: PronounKey): string {
  return verb.present[pronoun]
}
