import { useState } from 'react'
import type { Word } from '../types'
import { StudyTable } from './artikel/StudyTable'
import { TrainGame } from './artikel/TrainGame'

type ArtikelMode = 'menu' | 'study' | 'practice'

type ArtikelModuleProps = {
  words: Word[]
  onBack: () => void
}

export function ArtikelModule({ words, onBack }: ArtikelModuleProps) {
  const [mode, setMode] = useState<ArtikelMode>('menu')

  if (mode === 'study') {
    return <StudyTable words={words} onBack={() => setMode('menu')} />
  }

  if (mode === 'practice') {
    return <TrainGame allWords={words} onBack={() => setMode('menu')} />
  }

  return (
    <div className="app">
      <header className="header header--row">
        <div>
          <h1>Artikel</h1>
          <p className="subtitle">Practice German articles</p>
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
