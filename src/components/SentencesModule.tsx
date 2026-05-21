import { useState } from 'react'
import type { SentenceCard } from '../types/sentence'
import { SentenceStudy } from './sentences/SentenceStudy'
import { SentencePractice } from './sentences/SentencePractice'

type SentencesMode = 'menu' | 'study' | 'practice'

type SentencesModuleProps = {
  cards: SentenceCard[]
  onBack: () => void
}

export function SentencesModule({ cards, onBack }: SentencesModuleProps) {
  const [mode, setMode] = useState<SentencesMode>('menu')

  if (mode === 'study') {
    return <SentenceStudy cards={cards} onBack={() => setMode('menu')} />
  }

  if (mode === 'practice') {
    return <SentencePractice cards={cards} onBack={() => setMode('menu')} />
  }

  return (
    <div className="app">
      <header className="header header--row">
        <div>
          <h1>Sentences</h1>
          <p className="subtitle">German sentence composition (A1)</p>
        </div>
        <button type="button" className="back-btn" onClick={onBack}>
          ← Home
        </button>
      </header>
      <div className="mode-buttons">
        <button
          type="button"
          className="mode-btn mode-btn--study"
          onClick={() => setMode('study')}
        >
          Study
        </button>
        <button
          type="button"
          className="mode-btn mode-btn--practice"
          onClick={() => setMode('practice')}
        >
          Practice
        </button>
      </div>
    </div>
  )
}
