import { useEffect, useState } from 'react'
import type { Word } from './types'
import type { SentenceCard } from './types/sentence'
import type { StatementCard } from './types/statement'
import type { VerbEntry } from './types/verb'
import { loadWords } from './utils'
import { loadSentences } from './utils/sentences'
import { loadStatements } from './utils/statements'
import { loadVerbs } from './utils/verbs'
import { HomeHub } from './components/HomeHub'
import { ArtikelModule } from './components/ArtikelModule'
import { ConjugationModule } from './components/ConjugationModule'
import { SentencesModule } from './components/SentencesModule'
import { WordOrderModule } from './components/WordOrderModule'
import './App.css'

type AppMode = 'loading' | 'home' | 'artikel' | 'sentences' | 'wordorder' | 'conjugation'

function App() {
  const [mode, setMode] = useState<AppMode>('loading')
  const [error, setError] = useState<string | null>(null)
  const [allWords, setAllWords] = useState<Word[]>([])
  const [allSentences, setAllSentences] = useState<SentenceCard[]>([])
  const [allStatements, setAllStatements] = useState<StatementCard[]>([])
  const [allVerbs, setAllVerbs] = useState<VerbEntry[]>([])

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const [words, sentences, statements, verbs] = await Promise.all([
          loadWords(),
          loadSentences(),
          loadStatements(),
          loadVerbs(),
        ])
        if (cancelled) return
        setAllWords(words)
        setAllSentences(sentences)
        setAllStatements(statements)
        setAllVerbs(verbs)
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

  if (mode === 'conjugation') {
    return <ConjugationModule verbs={allVerbs} onBack={() => setMode('home')} />
  }

  return (
    <HomeHub
      onArtikel={() => setMode('artikel')}
      onSentences={() => setMode('sentences')}
      onWordOrder={() => setMode('wordorder')}
      onConjugation={() => setMode('conjugation')}
    />
  )
}

export default App
