export type SegmentType = 'subject' | 'verb' | 'time' | 'questionWord' | 'place' | 'other'

export interface PracticePair {
  pairId: string
  question: SentenceCard
  answer: SentenceCard
}

export type PracticeDirection = 'buildAnswer' | 'buildQuestion'

export interface PracticeRound {
  pair: PracticePair
  direction: PracticeDirection
}

export type PatternId =
  | 'time_first_v2'
  | 'subject_first'
  | 'w_question_wann'
  | 'w_question_was'
  | 'w_question_wann_was'
  | 'w_question_was_wann'
  | 'w_question_wo'
  | 'w_question_wohin'
  | 'w_question_wer'
  | 'w_question_wie'
  | 'pronoun_er_statement'
  | 'pronoun_sie_statement'
  | 'pronoun_ich_statement'
  | 'pronoun_du_statement'
  | 'pronoun_wir_statement'
  | 'connector_dann'

export type SentenceRole = 'question' | 'answer'

export interface Segment {
  id: string
  text: string
  english: string
  type: SegmentType
}

export interface SentenceCard {
  id: string
  pairId: string
  role: SentenceRole
  pattern: PatternId
  english: string
  segments: Segment[]
  correctOrder: string[]
  alternateOrders?: string[][]
  distractors?: string[]
}
