import type { ConjugationRound, PronounKey, VerbEntry } from '../types/verb'
import { shuffle } from '../utils'

/** Third-person singular shares one conjugation (and one practice slot). */
export const THIRD_PERSON_KEYS: PronounKey[] = ['er', 'sie', 'es']

export const THIRD_PERSON_LABEL = 'er · sie · es'

export type PronounPickSlot = PronounKey | 'third_singular'

export const PRONOUN_PICK_SLOTS: PronounPickSlot[] = [
  'ich',
  'du',
  'third_singular',
  'wir',
  'ihr',
  'sie_plural',
  'Sie',
]

export type TablePronounRow = {
  id: string
  label: string
  keys: PronounKey[]
}

/** Rows for the conjugation table (er/sie/es merged). */
export const TABLE_PRONOUN_ROWS: TablePronounRow[] = [
  { id: 'ich', label: 'ich', keys: ['ich'] },
  { id: 'du', label: 'du', keys: ['du'] },
  { id: 'third', label: THIRD_PERSON_LABEL, keys: THIRD_PERSON_KEYS },
  { id: 'wir', label: 'wir', keys: ['wir'] },
  { id: 'ihr', label: 'ihr', keys: ['ihr'] },
  { id: 'sie_plural', label: 'sie (they)', keys: ['sie_plural'] },
  { id: 'Sie', label: 'Sie (formal)', keys: ['Sie'] },
]

export const PRONOUN_LABELS: Record<PronounKey, string> = {
  ich: 'ich',
  du: 'du',
  er: THIRD_PERSON_LABEL,
  sie: THIRD_PERSON_LABEL,
  es: THIRD_PERSON_LABEL,
  wir: 'wir',
  ihr: 'ihr',
  sie_plural: 'sie (they)',
  Sie: 'Sie (formal)',
}

export function getPronounDisplayLabel(pronoun: PronounKey): string {
  return PRONOUN_LABELS[pronoun]
}

export function getTableRowForm(verb: VerbEntry, keys: PronounKey[]): string {
  const forms = keys.map((key) => verb.present[key]?.trim()).filter(Boolean)
  const unique = [...new Set(forms)]
  return unique.length === 1 ? unique[0] : forms.join(' / ')
}

function slotIsAvailable(verb: VerbEntry, slot: PronounPickSlot): boolean {
  if (slot === 'third_singular') {
    return THIRD_PERSON_KEYS.some((key) => verb.present[key]?.trim())
  }
  return Boolean(verb.present[slot]?.trim())
}

function resolvePickSlot(slot: PronounPickSlot): PronounKey {
  if (slot === 'third_singular') {
    return 'er'
  }
  return slot
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
  const availableSlots = PRONOUN_PICK_SLOTS.filter((slot) => slotIsAvailable(verb, slot))
  return shuffle(availableSlots).slice(0, 2).map(resolvePickSlot)
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
