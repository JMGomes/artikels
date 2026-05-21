import { useCallback, useState } from 'react'
import type { AnswerRecord, Artikel, Word } from '../../types'
import { pickRandomWords } from '../../utils'

const QUESTIONS_PER_ROUND = 10
const ARTICLES: Artikel[] = ['der', 'die', 'das']

type TrainPhase = 'playing' | 'finished'

type TrainGameProps = {
  allWords: Word[]
  onBack: () => void
}

export function TrainGame({ allWords, onBack }: TrainGameProps) {
  const [phase, setPhase] = useState<TrainPhase>('playing')
  const [roundWords, setRoundWords] = useState<Word[]>(() =>
    pickRandomWords(allWords, QUESTIONS_PER_ROUND),
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])

  const startRound = useCallback(() => {
    setRoundWords(pickRandomWords(allWords, QUESTIONS_PER_ROUND))
    setCurrentIndex(0)
    setAnswers([])
    setPhase('playing')
  }, [allWords])

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

  const score = answers.filter((entry) => entry.correct).length

  if (phase === 'finished') {
    return (
      <div className="app">
        <header className="header header--row">
          <div>
            <h1>Artikel Trainer</h1>
            <p className="subtitle">Round complete</p>
          </div>
          <button type="button" className="back-btn" onClick={onBack}>
            ← Menu
          </button>
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
                  <strong>
                    {entry.word.artikel} {entry.word.germanWord}
                  </strong>
                  <span className="translation">{entry.word.englishTranslation}</span>
                </div>
                {!entry.correct && (
                  <p className="result-user-answer">
                    You: {entry.userAnswer}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>

        <div className="action-buttons">
          <button type="button" className="primary-btn" onClick={startRound}>
            Play again
          </button>
          <button type="button" className="secondary-btn" onClick={onBack}>
            Menu
          </button>
        </div>
      </div>
    )
  }

  const currentWord = roundWords[currentIndex]

  return (
    <div className="app">
      <header className="header header--row">
        <div>
          <h1>Artikel Trainer</h1>
          <p className="subtitle">
            Question {currentIndex + 1} of {roundWords.length}
          </p>
        </div>
        <button type="button" className="back-btn" onClick={onBack}>
          ← Menu
        </button>
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
