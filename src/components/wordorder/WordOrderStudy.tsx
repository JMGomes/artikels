import { useMemo } from 'react'
import type { PatternFamily, StatementCard } from '../../types/statement'
import {
  PATTERN_FAMILY_INFO,
  STATEMENT_PATTERN_INFO,
  formatSlotRow,
  groupByPatternFamily,
} from '../../utils/statements'
import { StatementLine } from './StatementLine'

type WordOrderStudyProps = {
  cards: StatementCard[]
  onBack: () => void
}

function FamilyExample({ card }: { card: StatementCard }) {
  const familyInfo = PATTERN_FAMILY_INFO[card.patternFamily]
  const patternInfo = STATEMENT_PATTERN_INFO[card.pattern]
  const slots = formatSlotRow(card.slotOrder)

  return (
    <article className="study-pattern-card">
      <h3>
        {familyInfo.title} <span className="study-pattern-card__family">({card.patternFamily})</span>
      </h3>
      <p className="study-pattern-card__desc">{familyInfo.description}</p>
      <p className="study-pattern-card__slots">
        Pattern: {patternInfo.title} — {patternInfo.description}
      </p>
      <div className="slot-row" aria-label="Slot order">
        {slots.map((slot) => (
          <span key={slot} className="slot-row__cell">
            {slot}
          </span>
        ))}
      </div>
      <div className="study-pattern-card__block">
        <p className="study-pattern-card__label">{card.english}</p>
        {card.scopeNote && <p className="statement-scope-note">{card.scopeNote}</p>}
        <StatementLine card={card} order={card.correctOrder} showEnglish />
      </div>
    </article>
  )
}

export function WordOrderStudy({ cards, onBack }: WordOrderStudyProps) {
  const examples = useMemo(() => {
    const byFamily = groupByPatternFamily(cards.filter((c) => c.patternFamily !== 'F'))
    const result: { family: PatternFamily; card: StatementCard }[] = []

    for (const [family, list] of byFamily) {
      const card = list[Math.floor(Math.random() * list.length)]
      result.push({ family, card })
    }

    return result.sort((a, b) => a.family.localeCompare(b.family))
  }, [cards])

  return (
    <div className="app app--wide">
      <header className="header header--row">
        <div>
          <h1>Study</h1>
          <p className="subtitle">Daily routine · word order patterns</p>
        </div>
        <button type="button" className="back-btn" onClick={onBack}>
          ← Menu
        </button>
      </header>

      <div className="study-legend study-legend--segments">
        <span>
          <span className="segment-chip segment-chip--subject segment-chip--sample">subject</span>
        </span>
        <span>
          <span className="segment-chip segment-chip--verb segment-chip--sample">verb</span>
        </span>
        <span>
          <span className="segment-chip segment-chip--time segment-chip--sample">time</span>
        </span>
        <span>
          <span className="segment-chip segment-chip--mittelfeld segment-chip--sample">mittelfeld</span>
        </span>
        <span>
          <span className="segment-chip segment-chip--negation segment-chip--sample">nicht</span>
        </span>
        <span>
          <span className="segment-chip segment-chip--place segment-chip--sample">place</span>
        </span>
        <span>
          <span className="segment-chip segment-chip--object segment-chip--sample">object</span>
        </span>
      </div>

      <div className="study-patterns">
        {examples.map(({ family, card }) => (
          <FamilyExample key={family} card={card} />
        ))}
      </div>
    </div>
  )
}
