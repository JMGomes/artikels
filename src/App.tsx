import { useEffect, useState } from 'react'
import type { Word } from './types'
import type { SentenceCard } from './types/sentence'
import type { StatementCard } from './types/statement'
import type { ColorEntry } from './types/color'
import type { VerbEntry } from './types/verb'
import { loadWords } from './utils'
import { loadColors } from './utils/colors'
import { loadSentences } from './utils/sentences'
import { loadStatements } from './utils/statements'
import { loadVerbs } from './utils/verbs'
import { HomeHub } from './components/HomeHub'
import { ArtikelModule } from './components/ArtikelModule'
import { ColorsModule } from './components/ColorsModule'
import { TimeModule } from './components/TimeModule'
import { ConjugationModule } from './components/ConjugationModule'
import { SentencesModule } from './components/SentencesModule'
import { WordOrderModule } from './components/WordOrderModule'
import './App.css'

type AppMode =
  | 'loading'
  | 'home'
  | 'artikel'
  | 'sentences'
  | 'wordorder'
  | 'conjugation'
  | 'colors'
  | 'time'

function App() {
  const [mode, setMode] = useState<AppMode>('loading')
  const [error, setError] = useState<string | null>(null)
  const [allWords, setAllWords] = useState<Word[]>([])
  const [allSentences, setAllSentences] = useState<SentenceCard[]>([])
  const [allStatements, setAllStatements] = useState<StatementCard[]>([])
  const [allVerbs, setAllVerbs] = useState<VerbEntry[]>([])
  const [allColors, setAllColors] = useState<ColorEntry[]>([])

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const [words, sentences, statements, verbs, colors] = await Promise.all([
          loadWords(),
          loadSentences(),
          loadStatements(),
          loadVerbs(),
          loadColors(),
        ])
        if (cancelled) return
        setAllWords(words)
        setAllSentences(sentences)
        setAllStatements(statements)
        setAllVerbs(verbs)
        setAllColors(colors)
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

  if (mode === 'colors') {
    return <ColorsModule colors={allColors} onBack={() => setMode('home')} />
  }

  if (mode === 'time') {
    return <TimeModule onBack={() => setMode('home')} />
  }

  return (
    <HomeHub
      onArtikel={() => setMode('artikel')}
      onSentences={() => setMode('sentences')}
      onWordOrder={() => setMode('wordorder')}
      onConjugation={() => setMode('conjugation')}
      onColors={() => setMode('colors')}
      onTime={() => setMode('time')}
    />
  )
}

export default App
