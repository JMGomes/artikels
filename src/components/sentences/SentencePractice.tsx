import { useCallback, useMemo, useState } from 'react'
import type { PracticeRound, Segment } from '../../types/sentence'
import type { SentenceCard } from '../../types/sentence'
import {
  buildSegmentBank,
  getPromptAndTarget,
  gradeOrder,
  pickPracticeRounds,
  renderGermanSentence,
} from '../../utils/sentences'
import { ColoredSegment, SentenceLine } from './ColoredSegment'

const ROUND_SIZE = 4

type PracticePhase = 'playing' | 'roundComplete'

type RoundResult = {
  round: PracticeRound
  userOrder: string[]
  correct: boolean
}

type SentencePracticeProps = {
  cards: SentenceCard[]
  onBack: () => void
}

export function SentencePractice({ cards, onBack }: SentencePracticeProps) {
  const [rounds, setRounds] = useState<PracticeRound[]>(() =>
    pickPracticeRounds(cards, ROUND_SIZE),
  )
  const [index, setIndex] = useState(0)
  const [built, setBuilt] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)
  const [results, setResults] = useState<RoundResult[]>([])
  const [phase, setPhase] = useState<PracticePhase>('playing')

  const current = rounds[index]
  const ui = current ? getPromptAndTarget(current) : null
  const targetCard = ui?.targetCard

  const segmentBank = useMemo(
    () => (targetCard ? buildSegmentBank(targetCard, cards) : []),
    [targetCard, cards],
  )

  const targetSegmentIds = useMemo(
    () => new Set(targetCard?.segments.map((s) => s.id) ?? []),
    [targetCard],
  )

  const segmentById = useMemo(() => {
    const map = new Map<string, Segment>()
    if (targetCard) {
      for (const seg of targetCard.segments) map.set(seg.id, seg)
    }
    for (const seg of segmentBank) map.set(seg.id, seg)
    return map
  }, [targetCard, segmentBank])

  const usedIds = new Set(built)

  const startRound = useCallback(() => {
    setRounds(pickPracticeRounds(cards, ROUND_SIZE))
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
    if (!targetCard || !current || built.length !== targetCard.segments.length) return
    const correct = gradeOrder(targetCard, built)
    setWasCorrect(correct)
    setChecked(true)
    setResults((prev) => [...prev, { round: current, userOrder: built, correct }])
  }

  const handleNext = () => {
    if (index + 1 >= rounds.length) {
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
            {results.map((entry, i) => {
              const labels = getPromptAndTarget(entry.round)
              return (
                <li
                  key={`${i}-${entry.round.pair.pairId}-${entry.round.direction}`}
                  className={entry.correct ? 'result correct' : 'result incorrect'}
                >
                  <p className="result-meta">
                    <span className="result-meta__label">{labels.promptLabel}:</span>
                    <SentenceLine
                      card={labels.promptCard}
                      order={labels.promptCard.correctOrder}
                    />
                  </p>
                  <p className="result-built">
                    Du ({labels.targetLabel}):{' '}
                    {renderGermanSentence(labels.targetCard, entry.userOrder)}
                  </p>
                  {!entry.correct && (
                    <div className="result-correct-line">
                      <SentenceLine
                        card={labels.targetCard}
                        order={labels.targetCard.correctOrder}
                      />
                    </div>
                  )}
                </li>
              )
            })}
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

  if (!current || !ui || !targetCard) {
    return (
      <div className="app">
        <p className="error">
          Not enough question–answer pairs to practice. Add pairs in sentences.json.
        </p>
        <button type="button" className="back-btn" onClick={onBack}>
          ← Menu
        </button>
      </div>
    )
  }

  const builtSegments = built
    .map((id) => segmentById.get(id))
    .filter((s): s is Segment => Boolean(s))

  const canCheck = built.length === targetCard.segments.length && !checked

  return (
    <div className="app app--wide">
      <header className="header header--row">
        <div>
          <h1>Practice</h1>
          <p className="subtitle">
            {index + 1} of {rounds.length}
          </p>
        </div>
        <button type="button" className="back-btn" onClick={onBack}>
          ← Menu
        </button>
      </header>

      <section className="practice-question">
        <p className="prompt">{ui.promptLabel}</p>
        <SentenceLine card={ui.promptCard} order={ui.promptCard.correctOrder} />
      </section>

      <section className="practice-prompt">
        <p className="prompt">{ui.buildInstruction}</p>
        <p className="practice-prompt__hint">Klicke die Segmente in der richtigen Reihenfolge.</p>
      </section>

      <section className="build-area">
        <div className="build-area__header">
          <h2>{ui.targetLabel}</h2>
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
            {wasCorrect ? 'Richtig!' : ui.feedbackWrongLabel}
          </p>
        )}
        {checked && !wasCorrect && (
          <SentenceLine card={targetCard} order={targetCard.correctOrder} />
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
            {index + 1 >= rounds.length ? 'See results' : 'Next'}
          </button>
        )}
      </div>
    </div>
  )
}
