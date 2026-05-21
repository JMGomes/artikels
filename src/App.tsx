import { useEffect, useState } from 'react'
import type { Word } from './types'
import { loadWords } from './utils'
import { Landing } from './components/Landing'
import { StudyTable } from './components/StudyTable'
import { TrainGame } from './components/TrainGame'
import './App.css'

type AppMode = 'loading' | 'landing' | 'study' | 'practice'

function App() {
  const [mode, setMode] = useState<AppMode>('loading')
  const [error, setError] = useState<string | null>(null)
  const [allWords, setAllWords] = useState<Word[]>([])

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const words = await loadWords()
        if (cancelled) return
        setAllWords(words)
        setMode('landing')
      } catch {
        if (!cancelled) {
          setError('Failed to load words. Please refresh the page.')
        }
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <div className="app">
        <p className="error">{error}</p>
      </div>
    )
  }

  if (mode === 'loading') {
    return (
      <div className="app">
        <p className="loading">Loading vocabulary…</p>
      </div>
    )
  }

  if (mode === 'study') {
    return <StudyTable words={allWords} onBack={() => setMode('landing')} />
  }

  if (mode === 'practice') {
    return <TrainGame allWords={allWords} onBack={() => setMode('landing')} />
  }

  return (
    <Landing onStudy={() => setMode('study')} onPractice={() => setMode('practice')} />
  )
}

export default App
