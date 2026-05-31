import { useCallback, useMemo, useState } from 'react'
import type { StatementCard, StatementSegment } from '../../types/statement'
import {
  buildStatementSegmentBank,
  gradeStatementOrder,
  pickPracticeStatements,
  renderGermanStatement,
} from '../../utils/statements'
import { ColoredSegment } from '../sentences/ColoredSegment'
import { ResultAcceptedOrders } from './ResultAcceptedOrders'
import { StatementLine } from './StatementLine'

const ROUND_SIZE = 4

type PracticePhase = 'playing' | 'roundComplete'

type RoundResult = {
  card: StatementCard
  userOrder: string[]
  correct: boolean
}

type WordOrderPracticeProps = {
  cards: StatementCard[]
  onBack: () => void
}

export function WordOrderPractice({ cards, onBack }: WordOrderPracticeProps) {
  const [roundCards, setRoundCards] = useState<StatementCard[]>(() =>
    pickPracticeStatements(cards, ROUND_SIZE),
  )
  const [index, setIndex] = useState(0)
  const [built, setBuilt] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const [results, setResults] = useState<RoundResult[]>([])
  const [phase, setPhase] = useState<PracticePhase>('playing')

  const targetCard = roundCards[index]

  const segmentBank = useMemo(
    () => (targetCard ? buildStatementSegmentBank(targetCard, cards) : []),
    [targetCard, cards],
  )

  const targetSegmentIds = useMemo(
    () => new Set(targetCard?.segments.map((s) => s.id) ?? []),
    [targetCard],
  )

  const segmentById = useMemo(() => {
    const map = new Map<string, StatementSegment>()
    if (targetCard) {
      for (const seg of targetCard.segments) map.set(seg.id, seg)
    }
    for (const seg of segmentBank) map.set(seg.id, seg)
    return map
  }, [targetCard, segmentBank])

  const usedIds = new Set(built)

  const startRound = useCallback(() => {
    setRoundCards(pickPracticeStatements(cards, ROUND_SIZE))
    setIndex(0)
    setBuilt([])
    setChecked(false)
    setResults([])
    setPhase('playing')
  }, [cards])

  const handleSegmentClick = (seg: StatementSegment) => {
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
    if (!targetCard || built.length !== targetCard.segments.length) return
    const correct = gradeStatementOrder(targetCard, built)
    setWasCorrect(correct)
    setChecked(true)
    setResults((prev) => [...prev, { card: targetCard, userOrder: built, correct }])
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
                  <span className="result-meta__label">English:</span> {entry.card.english}
                </p>
                {entry.card.scopeNote && (
                  <p className="statement-scope-note">{entry.card.scopeNote}</p>
                )}
                <p className="result-built">
                  Du: {renderGermanStatement(entry.card, entry.userOrder)}
                </p>
                {(entry.card.alternateOrders?.length ?? 0) > 0 ? (
                  <ResultAcceptedOrders card={entry.card} userOrder={entry.userOrder} />
                ) : (
                  !entry.correct && (
                    <div className="result-correct-line">
                      <StatementLine card={entry.card} order={entry.card.correctOrder} />
                    </div>
                  )
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

  if (!targetCard) {
    return (
      <div className="app">
        <p className="error">Not enough statements to practice. Add cards in statements.json.</p>
        <button type="button" className="back-btn" onClick={onBack}>
          ← Menu
        </button>
      </div>
    )
  }

  const builtSegments = built
    .map((id) => segmentById.get(id))
    .filter((s): s is StatementSegment => Boolean(s))

  const canCheck = built.length === targetCard.segments.length && !checked

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

      <section className="practice-question">
        <p className="prompt">English</p>
        <p className="practice-english-prompt">{targetCard.english}</p>
        {targetCard.scopeNote && (
          <p className="statement-scope-note">{targetCard.scopeNote}</p>
        )}
      </section>

      <section className="practice-prompt">
        <p className="prompt">Build the German sentence</p>
        <p className="practice-prompt__hint">
          Slots: {targetCard.slotOrder}. Klicke die Segmente in der richtigen Reihenfolge.
        </p>
      </section>

      <section className="build-area">
        <div className="build-area__header">
          <h2>Dein Satz</h2>
          {!checked && (
            <button type="button" className="text-btn" onClick={handleClear}>
              Clear
            </button>
          )}
        </div>
        <div className="build-slots">
          {builtSegments.length === 0 && (
            <p className="build-slots__empty">Klicke die Segmente unten in der richtigen Reihenfolge</p>
          )}
          {builtSegments.map((seg) => (
            <ColoredSegment
              key={seg.id}
              segment={seg}
              inBuild
              extraneous={!targetSegmentIds.has(seg.id)}
              onClick={checked ? undefined : () => handleBuiltClick(seg.id)}
            />
          ))}
        </div>
        {checked && (
          <p
            className={`check-feedback ${wasCorrect ? 'check-feedback--ok' : 'check-feedback--bad'}`}
          >
            {wasCorrect ? 'Richtig!' : 'Nicht ganz — richtiger Satz:'}
          </p>
        )}
        {checked && !wasCorrect && (
          <StatementLine card={targetCard} order={targetCard.correctOrder} />
        )}
      </section>

      {!checked && (
        <section className="segment-bank">
          <h2>Segmente</h2>
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
