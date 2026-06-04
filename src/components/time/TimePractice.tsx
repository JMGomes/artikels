import { useCallback, useMemo, useState } from 'react'
import type { TimePair } from '../../types/time'
import {
  PAIRS_PER_TIME_SESSION,
  generateTimeSession,
  shuffleTimePairs,
} from '../../utils/time'

type TimePracticeProps = {
  onBack: () => void
}

type MatchState = 'playing' | 'complete'

export function TimePractice({ onBack }: TimePracticeProps) {
  const [sessionKey, setSessionKey] = useState(0)
  const [matchState, setMatchState] = useState<MatchState>('playing')
  const pairs = useMemo(
    () => generateTimeSession(PAIRS_PER_TIME_SESSION),
    [sessionKey],
  )
  const digitalOrder = useMemo(() => shuffleTimePairs(pairs), [pairs])
  const germanOrder = useMemo(() => shuffleTimePairs(pairs), [pairs])

  const [selectedDigitalId, setSelectedDigitalId] = useState<string | null>(null)
  const [matchedIds, setMatchedIds] = useState<Set<string>>(() => new Set())
  const [wrongPair, setWrongPair] = useState<{ digitalId: string; germanId: string } | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [mistakes, setMistakes] = useState(0)

  const total = pairs.length
  const matchedCount = matchedIds.size

  const resetSession = useCallback(() => {
    setSessionKey((k) => k + 1)
    setMatchState('playing')
    setSelectedDigitalId(null)
    setMatchedIds(new Set())
    setWrongPair(null)
    setAttempts(0)
    setMistakes(0)
  }, [])

  const handleDigitalClick = (id: string) => {
    if (matchState !== 'playing' || matchedIds.has(id)) return
    setWrongPair(null)
    setSelectedDigitalId((prev) => (prev === id ? null : id))
  }

  const handleGermanClick = (pair: TimePair) => {
    if (matchState !== 'playing' || !selectedDigitalId) return
    if (matchedIds.has(pair.id)) return

    setAttempts((n) => n + 1)

    if (selectedDigitalId === pair.id) {
      const next = new Set(matchedIds)
      next.add(pair.id)
      setMatchedIds(next)
      setSelectedDigitalId(null)
      setWrongPair(null)
      if (next.size >= total) {
        setMatchState('complete')
      }
      return
    }

    setMistakes((n) => n + 1)
    setWrongPair({ digitalId: selectedDigitalId, germanId: pair.id })
    setSelectedDigitalId(null)
    window.setTimeout(() => setWrongPair(null), 700)
  }

  if (matchState === 'complete') {
    return (
      <div className="app app--wide">
        <header className="header header--row">
          <div>
            <h1>Clock</h1>
            <p className="subtitle">All matched!</p>
          </div>
          <button type="button" className="back-btn" onClick={onBack}>
            ← Home
          </button>
        </header>

        <section className="score-card">
          <p className="score-label">Your score</p>
          <p className="score-value">
            {total - mistakes} / {total}
          </p>
          <p className="score-detail">
            {attempts} tries · {mistakes} mistake{mistakes === 1 ? '' : 's'}
          </p>
        </section>

        <div className="action-buttons">
          <button type="button" className="primary-btn" onClick={resetSession}>
            Play again
          </button>
          <button type="button" className="secondary-btn" onClick={onBack}>
            Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app app--wide">
      <header className="header header--row">
        <div>
          <h1>Clock</h1>
          <p className="subtitle">
            Match digital time to German · {matchedCount} / {total}
          </p>
        </div>
        <button type="button" className="back-btn" onClick={onBack}>
          ← Home
        </button>
      </header>

      <p className="color-match__hint">
        Tap a digital time, then tap the matching German phrase.
      </p>

      <div className="color-match color-match--stacked">
        <div className="color-match__column">
          <h2 className="color-match__heading">Digital</h2>
          <ul className="color-match__list">
            {digitalOrder.map((pair) => {
              const matched = matchedIds.has(pair.id)
              const selected = selectedDigitalId === pair.id
              const wrong = wrongPair?.digitalId === pair.id && !matched

              return (
                <li key={`d-${pair.id}`}>
                  <button
                    type="button"
                    className={[
                      'color-match__item',
                      'time-match__item--digital',
                      matched && 'color-match__item--matched',
                      selected && 'color-match__item--selected',
                      wrong && 'color-match__item--wrong',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    disabled={matched}
                    onClick={() => handleDigitalClick(pair.id)}
                  >
                    {pair.digital}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="color-match__column">
          <h2 className="color-match__heading">German</h2>
          <ul className="color-match__list">
            {germanOrder.map((pair) => {
              const matched = matchedIds.has(pair.id)
              const wrong = wrongPair?.germanId === pair.id && !matched

              return (
                <li key={`g-${pair.id}`}>
                  <button
                    type="button"
                    className={[
                      'color-match__item',
                      matched && 'color-match__item--matched',
                      wrong && 'color-match__item--wrong',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    disabled={matched}
                    onClick={() => handleGermanClick(pair)}
                  >
                    {pair.german}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
