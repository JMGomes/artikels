import { useCallback, useMemo, useState } from 'react'
import type { Segment, SentenceCard } from '../../types/sentence'
import {
  buildSegmentBank,
  gradeOrder,
  pickPracticeRound,
  renderOrderedText,
} from '../../utils/sentences'
import { shuffle } from '../../utils'
import { ColoredSegment, SentenceLine } from './ColoredSegment'

const ROUND_SIZE = 8

type PracticePhase = 'playing' | 'roundComplete'

type RoundResult = {
  card: SentenceCard
  userOrder: string[]
  correct: boolean
}

type SentencePracticeProps = {
  cards: SentenceCard[]
  onBack: () => void
}

function pickBalancedRound(cards: SentenceCard[], count: number): SentenceCard[] {
  const questions = cards.filter((c) => c.role === 'question')
  const answers = cards.filter((c) => c.role === 'answer')
  const half = Math.floor(count / 2)
  const qPick = shuffle(questions).slice(0, half)
  const aPick = shuffle(answers).slice(0, count - half)
  const combined = shuffle([...qPick, ...aPick])
  if (combined.length >= count) return combined.slice(0, count)
  return pickPracticeRound(cards, count)
}

export function SentencePractice({ cards, onBack }: SentencePracticeProps) {
  const [roundCards, setRoundCards] = useState<SentenceCard[]>(() =>
    pickBalancedRound(cards, ROUND_SIZE),
  )
  const [index, setIndex] = useState(0)
  const [built, setBuilt] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const [results, setResults] = useState<RoundResult[]>([])
  const [phase, setPhase] = useState<PracticePhase>('playing')

  const current = roundCards[index]
  const segmentBank = useMemo(
    () => (current ? buildSegmentBank(current, cards) : []),
    [current, cards],
  )

  const usedIds = new Set(built)

  const startRound = useCallback(() => {
    setRoundCards(pickBalancedRound(cards, ROUND_SIZE))
    setIndex(0)
    setBuilt([])
    setChecked(false)
    setResults([])
    setPhase('playing')
  }, [cards])

  const handleSegmentClick = (seg: Segment) => {
    if (checked || built.includes(seg.id)) return
    setBuilt((prev) => [...prev, seg.id])
  }

  const handleBuiltClick = (segId: string) => {
    if (checked) return
    setBuilt((prev) => prev.filter((id) => id !== segId))
  }

  const handleClear = () => {
    if (checked) return
    setBuilt([])
  }

  const handleCheck = () => {
    if (!current || built.length !== current.segments.length) return
    const correct = gradeOrder(current, built)
    setWasCorrect(correct)
    setChecked(true)
    setResults((prev) => [...prev, { card: current, userOrder: built, correct }])
  }

  const handleNext = () => {
    if (index + 1 >= roundCards.length) {
      setPhase('roundComplete')
      return
    }
    setIndex((i) => i + 1)
    setBuilt([])
    setChecked(false)
    setWasCorrect(false)
  }

  if (phase === 'roundComplete') {
    const score = results.filter((r) => r.correct).length
    return (
      <div className="app app--wide">
        <header className="header header--row">
          <div>
            <h1>Practice</h1>
            <p className="subtitle">Round complete</p>
          </div>
          <button type="button" className="back-btn" onClick={onBack}>
            ← Menu
          </button>
        </header>

        <section className="score-card">
          <p className="score-label">Your score</p>
          <p className="score-value">
            {score} / {results.length}
          </p>
        </section>

        <section className="results">
          <h2>Results</h2>
          <ul className="results-list">
            {results.map((entry, i) => (
              <li
                key={`${i}-${entry.card.id}`}
                className={entry.correct ? 'result correct' : 'result incorrect'}
              >
                <p className="result-meta">
                  Build the <strong>{entry.card.role}</strong> · {entry.card.english}
                </p>
                <p className="result-built">
                  You: {renderOrderedText(entry.card, entry.userOrder)}
                </p>
                {!entry.correct && (
                  <div className="result-correct-line">
                    <SentenceLine card={entry.card} order={entry.card.correctOrder} />
                  </div>
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

  if (!current) {
    return (
      <div className="app">
        <p className="error">Not enough sentence cards to practice.</p>
        <button type="button" className="back-btn" onClick={onBack}>
          ← Menu
        </button>
      </div>
    )
  }

  const builtSegments = built
    .map((id) => current.segments.find((s) => s.id === id))
    .filter((s): s is Segment => Boolean(s))

  const canCheck = built.length === current.segments.length && !checked

  return (
    <div className="app app--wide">
      <header className="header header--row">
        <div>
          <h1>Practice</h1>
          <p className="subtitle">
            {index + 1} of {roundCards.length}
          </p>
        </div>
        <button type="button" className="back-btn" onClick={onBack}>
          ← Menu
        </button>
      </header>

      <section className="practice-prompt">
        <p className="prompt">Build the {current.role}</p>
        <p className="practice-prompt__english">{current.english}</p>
      </section>

      <section className="build-area">
        <div className="build-area__header">
          <h2>Your sentence</h2>
          {!checked && (
            <button type="button" className="text-btn" onClick={handleClear}>
              Clear
            </button>
          )}
        </div>
        <div className="build-slots">
          {builtSegments.length === 0 && (
            <p className="build-slots__empty">Click segments below in order</p>
          )}
          {builtSegments.map((seg) => (
            <ColoredSegment
              key={seg.id}
              segment={seg}
              inBuild
              onClick={checked ? undefined : () => handleBuiltClick(seg.id)}
            />
          ))}
        </div>
        {checked && (
          <p className={`check-feedback ${wasCorrect ? 'check-feedback--ok' : 'check-feedback--bad'}`}>
            {wasCorrect ? 'Correct!' : 'Not quite — see the correct order:'}
          </p>
        )}
        {checked && !wasCorrect && (
          <SentenceLine card={current} order={current.correctOrder} />
        )}
      </section>

      {!checked && (
        <section className="segment-bank">
          <h2>Segments</h2>
          <div className="segment-bank__chips">
            {segmentBank.map((seg) => (
              <ColoredSegment
                key={seg.id}
                segment={seg}
                showEnglish
                used={usedIds.has(seg.id)}
                onClick={() => handleSegmentClick(seg)}
              />
            ))}
          </div>
        </section>
      )}

      <div className="practice-actions">
        {!checked ? (
          <button type="button" className="primary-btn" disabled={!canCheck} onClick={handleCheck}>
            Check
          </button>
        ) : (
          <button type="button" className="primary-btn" onClick={handleNext}>
            {index + 1 >= roundCards.length ? 'See results' : 'Next'}
          </button>
        )}
      </div>
    </div>
  )
}
