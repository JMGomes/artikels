import { useState } from 'react'
import type { ColorEntry } from '../types/color'
import { ColorPractice } from './colors/ColorPractice'
import { ColorStudy } from './colors/ColorStudy'

type ColorsMode = 'menu' | 'study' | 'practice'

type ColorsModuleProps = {
  colors: ColorEntry[]
  onBack: () => void
}

export function ColorsModule({ colors, onBack }: ColorsModuleProps) {
  const [mode, setMode] = useState<ColorsMode>('menu')

  if (mode === 'study') {
    return <ColorStudy colors={colors} onBack={() => setMode('menu')} />
  }

  if (mode === 'practice') {
    return <ColorPractice colors={colors} onBack={() => setMode('menu')} />
  }

  return (
    <div className="app">
      <header className="header header--row">
        <div>
          <h1>Colors</h1>
          <p className="subtitle">English ↔ German</p>
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
