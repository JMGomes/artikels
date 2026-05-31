import { useCallback, useMemo, useState, type KeyboardEvent } from 'react'
import type { ConjugationRound, PronounKey } from '../../types/verb'
import type { VerbEntry } from '../../types/verb'
import {
  PRONOUN_LABELS,
  buildSessionRounds,
  getConjugationForm,
  gradeConjugation,
} from '../../utils/verbs'
import { ConjugationTable } from './ConjugationTable'

const ROUNDS_PER_SESSION = 4
const PROMPTS_PER_ROUND = 2

type Phase = 'prompt' | 'roundComplete' | 'sessionComplete'

type ConjugationPracticeProps = {
  verbs: VerbEntry[]
  onBack: () => void
}

function emptyInputs(): [string, string] {
  return ['', '']
}

export function ConjugationPractice({ verbs, onBack }: ConjugationPracticeProps) {
  const [rounds, setRounds] = useState<ConjugationRound[]>(() =>
    buildSessionRounds(verbs, ROUNDS_PER_SESSION),
  )
  const [roundIndex, setRoundIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('prompt')
  const [inputs, setInputs] = useState<[string, string]>(emptyInputs)
  const [checked, setChecked] = useState(false)

  const currentRound = rounds[roundIndex]
  const pronouns = currentRound?.pronouns ?? []

  const totalCorrect = useMemo(
    () => rounds.reduce((sum, r) => sum + r.results.filter((x) => x.correct).length, 0),
    [rounds],
  )
  const totalPrompts = rounds.length * PROMPTS_PER_ROUND

  const startSession = useCallback(() => {
    setRounds(buildSessionRounds(verbs, ROUNDS_PER_SESSION))
    setRoundIndex(0)
    setPhase('prompt')
    setInputs(emptyInputs())
    setChecked(false)
  }, [verbs])

  const bothFilled = inputs[0].trim() !== '' && inputs[1].trim() !== ''

  const handleCheck = () => {
    if (!currentRound || checked || !bothFilled) return

    const newResults = pronouns.map((pronoun, i) => {
      const expected = getConjugationForm(currentRound.verb, pronoun)
      const userAnswer = inputs[i].trim()
      return {
        verb: currentRound.verb,
        pronoun,
        userAnswer,
        correct: gradeConjugation(expected, userAnswer),
      }
    })

    setRounds((prev) => {
      const next = [...prev]
      next[roundIndex] = {
        ...next[roundIndex],
        results: newResults,
      }
      return next
    })
    setChecked(true)
  }

  const handleNext = () => {
    if (phase === 'prompt') {
      setPhase('roundComplete')
      return
    }

    if (phase === 'roundComplete') {
      if (roundIndex + 1 >= rounds.length) {
        setPhase('sessionComplete')
        return
      }
      setRoundIndex((i) => i + 1)
      setPhase('prompt')
      setInputs(emptyInputs())
      setChecked(false)
    }
  }

  const setInputAt = (index: 0 | 1, value: string) => {
    setInputs((prev) => {
      const next: [string, string] = [...prev]
      next[index] = value
      return next
    })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !checked && bothFilled) {
      handleCheck()
    }
  }

  const resultFor = (pronoun: PronounKey) =>
    currentRound?.results.find((r) => r.pronoun === pronoun)

  if (phase === 'sessionComplete') {
    return (
      <div className="app app--wide">
        <header className="header header--row">
          <div>
            <h1>Practice</h1>
            <p className="subtitle">Session complete</p>
          </div>
          <button type="button" className="back-btn" onClick={onBack}>
            ← Menu
          </button>
        </header>

        <section className="score-card">
          <p className="score-label">Your score</p>
          <p className="score-value">
            {totalCorrect} / {totalPrompts}
          </p>
        </section>

        <section className="results">
          <h2>Your answers</h2>
          <ul className="results-list">
            {rounds.flatMap((round) =>
              round.results.map((r, i) => (
                <li
                  key={`${round.verb.id}-${r.pronoun}-${i}`}
                  className={r.correct ? 'result correct' : 'result incorrect'}
                >
                  <strong>{round.verb.infinitive}</strong> ({round.verb.english}) —{' '}
                  {PRONOUN_LABELS[r.pronoun]}: you wrote <em>{r.userAnswer || '—'}</em>
                  {!r.correct && (
                    <>
                      {' '}
                      · correct: <em>{getConjugationForm(round.verb, r.pronoun)}</em>
                    </>
                  )}
                </li>
              )),
            )}
          </ul>
        </section>

        <section className="conjugation-session-tables">
          <h2>Full conjugations</h2>
          {rounds.map((round) => {
            const wrong = round.results.filter((r) => !r.correct).map((r) => r.pronoun)
            return (
              <ConjugationTable
                key={round.verb.id}
                verb={round.verb}
                testedPronouns={round.pronouns}
                wrongPronouns={wrong}
              />
            )
          })}
        </section>

        <div className="action-buttons">
          <button type="button" className="primary-btn" onClick={startSession}>
            Play again
          </button>
          <button type="button" className="secondary-btn" onClick={onBack}>
            Menu
          </button>
        </div>
      </div>
    )
  }

  if (!currentRound || pronouns.length < PROMPTS_PER_ROUND) {
    return (
      <div className="app">
        <p className="error">Not enough verbs to practice. Add verbs in verbs.json.</p>
        <button type="button" className="back-btn" onClick={onBack}>
          ← Menu
        </button>
      </div>
    )
  }

  if (phase === 'roundComplete') {
    const wrong = currentRound.results.filter((r) => !r.correct).map((r) => r.pronoun)
    return (
      <div className="app app--wide">
        <header className="header header--row">
          <div>
            <h1>Practice</h1>
            <p className="subtitle">
              Verb {roundIndex + 1} of {rounds.length} — full conjugation
            </p>
          </div>
          <button type="button" className="back-btn" onClick={onBack}>
            ← Menu
          </button>
        </header>

        <ConjugationTable
          verb={currentRound.verb}
          testedPronouns={currentRound.pronouns}
          wrongPronouns={wrong}
        />

        <div className="practice-actions">
          <button type="button" className="primary-btn" onClick={handleNext}>
            {roundIndex + 1 >= rounds.length ? 'See results' : 'Next verb'}
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
            Verb {roundIndex + 1} of {rounds.length}
          </p>
        </div>
        <button type="button" className="back-btn" onClick={onBack}>
          ← Menu
        </button>
      </header>

      <section className="conjugation-prompt-card">
        <p className="conjugation-prompt-card__verb">
          <strong>{currentRound.verb.infinitive}</strong>
          <span className="conjugation-prompt-card__en">({currentRound.verb.english})</span>
        </p>

        <div className="conjugation-prompt-rows">
          {pronouns.map((pronoun, i) => {
            const expected = getConjugationForm(currentRound.verb, pronoun)
            const result = resultFor(pronoun)
            const inputClass = [
              'conjugation-input',
              checked && result?.correct && 'conjugation-input--correct',
              checked && result && !result.correct && 'conjugation-input--wrong',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <div key={pronoun} className="conjugation-prompt-row">
                <label className="conjugation-prompt-row__label" htmlFor={`conj-${pronoun}`}>
                  {PRONOUN_LABELS[pronoun]}
                </label>
                <div className="conjugation-prompt-row__field">
                  <input
                    id={`conj-${pronoun}`}
                    type="text"
                    className={inputClass}
                    value={inputs[i]}
                    onChange={(e) => setInputAt(i as 0 | 1, e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={checked}
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                  {checked && result && !result.correct && (
                    <p className="conjugation-prompt-row__hint">
                      Richtig: <strong>{expected}</strong>
                    </p>
                  )}
                  {checked && result?.correct && (
                    <p className="conjugation-prompt-row__hint conjugation-prompt-row__hint--ok">
                      Richtig!
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="practice-actions">
        {!checked ? (
          <button
            type="button"
            className="primary-btn"
            disabled={!bothFilled}
            onClick={handleCheck}
          >
            Check
          </button>
        ) : (
          <button type="button" className="primary-btn" onClick={handleNext}>
            Next
          </button>
        )}
      </div>
    </div>
  )
}
