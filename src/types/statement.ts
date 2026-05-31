export type PatternFamily = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export type StatementPatternId =
  | 'subject_first_simple'
  | 'time_first_v2'
  | 'time_nicht_scope'
  | 'modifiers_chain'

export type StatementSegmentType =
  | 'subject'
  | 'verb'
  | 'time'
  | 'place'
  | 'mittelfeld'
  | 'negation'
  | 'object'
  | 'other'

export interface StatementSegment {
  id: string
  text: string
  english: string
  type: StatementSegmentType
}

export interface StatementCard {
  id: string
  patternFamily: PatternFamily
  pattern: StatementPatternId
  english: string
  /** Shown in Study: e.g. "Subject · Verb · Mittelfeld · Object" */
  slotOrder: string
  /** Clarifies nicht scope when needed (pattern family C). */
  scopeNote?: string
  segments: StatementSegment[]
  correctOrder: string[]
  /** Only for safe word-order variants (e.g. time-first); never for nicht scope. */
  alternateOrders?: string[][]
  distractors?: string[]
}
