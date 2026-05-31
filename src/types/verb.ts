export type PronounKey =
  | 'ich'
  | 'du'
  | 'er'
  | 'sie'
  | 'es'
  | 'wir'
  | 'ihr'
  | 'sie_plural'
  | 'Sie'

export interface VerbEntry {
  id: string
  infinitive: string
  english: string
  present: Record<PronounKey, string>
}

export type ConjugationPromptResult = {
  verb: VerbEntry
  pronoun: PronounKey
  userAnswer: string
  correct: boolean
}

export type ConjugationRound = {
  verb: VerbEntry
  pronouns: PronounKey[]
  results: ConjugationPromptResult[]
}
