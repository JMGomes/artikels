import { useState } from 'react'
import type { StatementCard } from '../types/statement'
import { WordOrderPractice } from './wordorder/WordOrderPractice'
import { WordOrderStudy } from './wordorder/WordOrderStudy'

type WordOrderMode = 'menu' | 'study' | 'practice'

type WordOrderModuleProps = {
  cards: StatementCard[]
  onBack: () => void
}

export function WordOrderModule({ cards, onBack }: WordOrderModuleProps) {
  const [mode, setMode] = useState<WordOrderMode>('menu')

  if (mode === 'study') {
    return <WordOrderStudy cards={cards} onBack={() => setMode('menu')} />
  }

  if (mode === 'practice') {
    return <WordOrderPractice cards={cards} onBack={() => setMode('menu')} />
  }

  return (
    <div className="app">
      <header className="header header--row">
        <div>
          <h1>Word order</h1>
          <p className="subtitle">Daily routine · ich/du/wir · time &amp; nicht</p>
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
