export type Artikel = 'der' | 'die' | 'das'

export interface Word {
  germanWord: string
  englishTranslation: string
  artikel: Artikel
  pluralForm: string
}

export interface AnswerRecord {
  word: Word
  userAnswer: Artikel
  correct: boolean
}
