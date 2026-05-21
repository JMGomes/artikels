export type SegmentType = 'subject' | 'verb' | 'other'

export type PatternId =
  | 'time_first_v2'
  | 'subject_first'
  | 'w_question_wann'
  | 'w_question_was'
  | 'w_question_wann_was'
  | 'w_question_was_wann'
  | 'pronoun_er_statement'
  | 'pronoun_ich_statement'
  | 'coordination_und'
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
