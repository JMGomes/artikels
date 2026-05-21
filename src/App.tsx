import { useCallback, useEffect, useState } from 'react'
import type { AnswerRecord, Artikel, Word } from './types'
import { loadWords, pickRandomWords } from './utils'
import './App.css'

const QUESTIONS_PER_ROUND = 10
const ARTICLES: Artikel[] = ['der', 'die', 'das']

type GamePhase = 'loading' | 'playing' | 'finished'

function App() {
  const [phase, setPhase] = useState<GamePhase>('loading')
  const [error, setError] = useState<string | null>(null)
  const [allWords, setAllWords] = useState<Word[]>([])
  const [roundWords, setRoundWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])

  const startRound = useCallback((words: Word[]) => {
    setRoundWords(pickRandomWords(words, QUESTIONS_PER_ROUND))
    setCurrentIndex(0)
    setAnswers([])
    setPhase('playing')
  }, [])

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const words = await loadWords()
        if (cancelled) return
        setAllWords(words)
        startRound(words)
      } catch {
        if (!cancelled) {
          setError('Failed to load words. Please refresh the page.')
          setPhase('loading')
        }
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [startRound])

  const handleAnswer = (choice: Artikel) => {
    const word = roundWords[currentIndex]
    const record: AnswerRecord = {
      word,
      userAnswer: choice,
      correct: choice === word.artikel,
    }
    const nextAnswers = [...answers, record]

    if (currentIndex + 1 >= roundWords.length) {
      setAnswers(nextAnswers)
      setPhase('finished')
      return
    }

    setAnswers(nextAnswers)
    setCurrentIndex((index) => index + 1)
  }

  const handleRestart = () => {
    if (allWords.length === 0) return
    startRound(allWords)
  }

  const score = answers.filter((entry) => entry.correct).length

  if (error) {
    return (
      <div className="app">
        <p className="error">{error}</p>
      </div>
    )
  }

  if (phase === 'loading') {
    return (
      <div className="app">
        <p className="loading">Loading vocabulary…</p>
      </div>
    )
  }

  if (phase === 'finished') {
    return (
      <div className="app">
        <header className="header">
          <h1>Artikel Trainer</h1>
          <p className="subtitle">Round complete</p>
        </header>

        <section className="score-card">
          <p className="score-label">Your score</p>
          <p className="score-value">
            {score} / {roundWords.length}
          </p>
        </section>

        <section className="results">
          <h2>Answers</h2>
          <ul className="results-list">
            {answers.map((entry, index) => (
              <li
                key={`${index}-${entry.word.germanWord}`}
                className={entry.correct ? 'result correct' : 'result incorrect'}
              >
                <div className="result-word">
                  <strong>{entry.word.germanWord}</strong>
                  <span className="translation">{entry.word.englishTranslation}</span>
                </div>
                <div className="result-answers">
                  <span>
                    You: <em>{entry.userAnswer}</em>
                  </span>
                  <span>
                    Correct: <em>{entry.word.artikel}</em>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <button type="button" className="primary-btn" onClick={handleRestart}>
          Play again
        </button>
      </div>
    )
  }

  const currentWord = roundWords[currentIndex]

  return (
    <div className="app">
      <header className="header">
        <h1>Artikel Trainer</h1>
        <p className="subtitle">
          Question {currentIndex + 1} of {roundWords.length}
        </p>
      </header>

      <section className="question-card">
        <p className="prompt">Choose the correct article</p>
        <h2 className="german-word">{currentWord.germanWord}</h2>
        <p className="translation">{currentWord.englishTranslation}</p>
        <p className="plural">Plural: {currentWord.pluralForm}</p>
      </section>

      <div className="article-buttons">
        {ARTICLES.map((article) => (
          <button
            key={article}
            type="button"
            className={`article-btn article-${article}`}
            onClick={() => handleAnswer(article)}
          >
            {article}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
