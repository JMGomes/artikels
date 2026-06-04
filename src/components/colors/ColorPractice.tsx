import { useCallback, useMemo, useState } from 'react'
import type { ColorEntry } from '../../types/color'
import { colorPracticeBackground, shuffleColors } from '../../utils/colors'

type ColorPracticeProps = {
  colors: ColorEntry[]
  onBack: () => void
}

type MatchState = 'playing' | 'complete'

export function ColorPractice({ colors, onBack }: ColorPracticeProps) {
  const [sessionKey, setSessionKey] = useState(0)
  const [matchState, setMatchState] = useState<MatchState>('playing')
  const englishOrder = useMemo(
    () => shuffleColors(colors),
    [colors, sessionKey],
  )
  const germanOrder = useMemo(
    () => shuffleColors(colors),
    [colors, sessionKey],
  )
  const [selectedEnglishId, setSelectedEnglishId] = useState<string | null>(null)
  const [matchedIds, setMatchedIds] = useState<Set<string>>(() => new Set())
  const [wrongPair, setWrongPair] = useState<{ englishId: string; germanId: string } | null>(
    null,
  )
  const [attempts, setAttempts] = useState(0)
  const [mistakes, setMistakes] = useState(0)

  const matchedCount = matchedIds.size
  const total = colors.length

  const germanMatched = useMemo(() => {
    const ids = new Set<string>()
    for (const englishId of matchedIds) {
      ids.add(englishId)
    }
    return ids
  }, [matchedIds])

  const resetSession = useCallback(() => {
    setSessionKey((k) => k + 1)
    setMatchState('playing')
    setSelectedEnglishId(null)
    setMatchedIds(new Set())
    setWrongPair(null)
    setAttempts(0)
    setMistakes(0)
  }, [])

  const handleEnglishClick = (id: string) => {
    if (matchState !== 'playing' || matchedIds.has(id)) return
    setWrongPair(null)
    setSelectedEnglishId((prev) => (prev === id ? null : id))
  }

  const handleGermanClick = (germanColor: ColorEntry) => {
    if (matchState !== 'playing' || !selectedEnglishId) return
    if (germanMatched.has(germanColor.id)) return

    setAttempts((n) => n + 1)

    if (selectedEnglishId === germanColor.id) {
      const next = new Set(matchedIds)
      next.add(germanColor.id)
      setMatchedIds(next)
      setSelectedEnglishId(null)
      setWrongPair(null)
      if (next.size >= total) {
        setMatchState('complete')
      }
      return
    }

    setMistakes((n) => n + 1)
    setWrongPair({ englishId: selectedEnglishId, germanId: germanColor.id })
    setSelectedEnglishId(null)
    window.setTimeout(() => setWrongPair(null), 700)
  }

  if (matchState === 'complete') {
    return (
      <div className="app app--wide">
        <header className="header header--row">
          <div>
            <h1>Practice</h1>
            <p className="subtitle">All matched!</p>
          </div>
          <button type="button" className="back-btn" onClick={onBack}>
            ← Menu
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
            Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app app--wide">
      <header className="header header--row">
        <div>
          <h1>Practice</h1>
          <p className="subtitle">
            Match English to German · {matchedCount} / {total}
          </p>
        </div>
        <button type="button" className="back-btn" onClick={onBack}>
          ← Menu
        </button>
      </header>

      <p className="color-match__hint">
        Tap an English color, then tap its German name. Everything stays on this screen.
      </p>

      <div className="color-match">
        <div className="color-match__column">
          <h2 className="color-match__heading">English</h2>
          <ul className="color-match__list">
            {englishOrder.map((color) => {
              const matched = matchedIds.has(color.id)
              const selected = selectedEnglishId === color.id
              const wrong =
                wrongPair?.englishId === color.id && !matched
              return (
                <li key={color.id}>
                  <button
                    type="button"
                    className={[
                      'color-match__item',
                      'color-match__item--filled',
                      matched && 'color-match__item--matched',
                      selected && 'color-match__item--selected',
                      wrong && 'color-match__item--wrong',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={{ backgroundColor: colorPracticeBackground(color.hex) }}
                    disabled={matched}
                    onClick={() => handleEnglishClick(color.id)}
                  >
                    {color.english}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="color-match__column">
          <h2 className="color-match__heading">German</h2>
          <ul className="color-match__list">
            {germanOrder.map((color) => {
              const matched = germanMatched.has(color.id)
              const wrong = wrongPair?.germanId === color.id && !matched

              return (
                <li key={`de-${color.id}`}>
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
                    onClick={() => handleGermanClick(color)}
                  >
                    {color.german}
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
