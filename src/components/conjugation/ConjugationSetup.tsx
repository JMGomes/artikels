import { useMemo, useState } from 'react'
import type { VerbEntry, VerbFilter } from '../../types/verb'
import { countVerbsByType, filterVerbsByType } from '../../utils/verbs'

const MIN_VERBS_FOR_SESSION = 4

type ConjugationSetupProps = {
  verbs: VerbEntry[]
  onBack: () => void
  onStart: (filteredVerbs: VerbEntry[], filter: VerbFilter) => void
}

export function ConjugationSetup({ verbs, onBack, onStart }: ConjugationSetupProps) {
  const counts = useMemo(() => countVerbsByType(verbs), [verbs])
  const [includeRegular, setIncludeRegular] = useState(true)
  const [includeIrregular, setIncludeIrregular] = useState(true)

  const filter: VerbFilter = { includeRegular, includeIrregular }
  const filtered = useMemo(() => filterVerbsByType(verbs, filter), [verbs, filter])
  const canStart = filtered.length >= MIN_VERBS_FOR_SESSION

  return (
    <div className="app">
      <header className="header header--row">
        <div>
          <h1>Verbs</h1>
          <p className="subtitle">Present tense · choose what to practice</p>
        </div>
        <button type="button" className="back-btn" onClick={onBack}>
          ← Home
        </button>
      </header>

      <section className="conjugation-setup">
        <p className="conjugation-setup__intro">
          Pick regular verbs, irregular verbs, or both. Each session uses 4 different verbs.
        </p>

        <label className="conjugation-setup__option">
          <input
            type="checkbox"
            checked={includeRegular}
            onChange={(e) => setIncludeRegular(e.target.checked)}
          />
          <span className="conjugation-setup__option-text">
            <strong>Regular verbs</strong>
            <span className="conjugation-setup__count">{counts.regular} verbs</span>
          </span>
        </label>

        <label className="conjugation-setup__option">
          <input
            type="checkbox"
            checked={includeIrregular}
            onChange={(e) => setIncludeIrregular(e.target.checked)}
          />
          <span className="conjugation-setup__option-text">
            <strong>Irregular verbs</strong>
            <span className="conjugation-setup__count">{counts.irregular} verbs</span>
          </span>
        </label>

        <p className="conjugation-setup__summary">
          {filtered.length} verb{filtered.length === 1 ? '' : 's'} in this session pool
        </p>

        {!includeRegular && !includeIrregular && (
          <p className="conjugation-setup__hint conjugation-setup__hint--warn">
            Select at least one type.
          </p>
        )}

        {includeRegular || includeIrregular ? (
          !canStart ? (
            <p className="conjugation-setup__hint conjugation-setup__hint--warn">
              Need at least {MIN_VERBS_FOR_SESSION} verbs — turn on the other type or add more in
              verbs.json.
            </p>
          ) : null
        ) : null}
      </section>

      <div className="practice-actions">
        <button
          type="button"
          className="primary-btn"
          disabled={!canStart}
          onClick={() => onStart(filtered, filter)}
        >
          Start practice
        </button>
      </div>
    </div>
  )
}
