import { useEffect, useState } from 'react'
import type { Word } from './types'
import type { SentenceCard } from './types/sentence'
import type { StatementCard } from './types/statement'
import { loadWords } from './utils'
import { loadSentences } from './utils/sentences'
import { loadStatements } from './utils/statements'
import { HomeHub } from './components/HomeHub'
import { ArtikelModule } from './components/ArtikelModule'
import { SentencesModule } from './components/SentencesModule'
import { WordOrderModule } from './components/WordOrderModule'
import './App.css'

type AppMode = 'loading' | 'home' | 'artikel' | 'sentences' | 'wordorder'

function App() {
  const [mode, setMode] = useState<AppMode>('loading')
  const [error, setError] = useState<string | null>(null)
  const [allWords, setAllWords] = useState<Word[]>([])
  const [allSentences, setAllSentences] = useState<SentenceCard[]>([])
  const [allStatements, setAllStatements] = useState<StatementCard[]>([])

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const [words, sentences, statements] = await Promise.all([
          loadWords(),
          loadSentences(),
          loadStatements(),
        ])
        if (cancelled) return
        setAllWords(words)
        setAllSentences(sentences)
        setAllStatements(statements)
        setMode('home')
      } catch {
        if (!cancelled) {
          setError('Failed to load data. Please refresh the page.')
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
        <p className="loading">Loading…</p>
      </div>
    )
  }

  if (mode === 'artikel') {
    return <ArtikelModule words={allWords} onBack={() => setMode('home')} />
  }

  if (mode === 'sentences') {
    return <SentencesModule cards={allSentences} onBack={() => setMode('home')} />
  }

  if (mode === 'wordorder') {
    return <WordOrderModule cards={allStatements} onBack={() => setMode('home')} />
  }

  return (
    <HomeHub
      onArtikel={() => setMode('artikel')}
      onSentences={() => setMode('sentences')}
      onWordOrder={() => setMode('wordorder')}
    />
  )
}

export default App
