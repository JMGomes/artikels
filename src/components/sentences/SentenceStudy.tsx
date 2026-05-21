import { useMemo } from 'react'
import type { PatternId, SentenceCard } from '../../types/sentence'
import {
  PATTERN_INFO,
  getPairCards,
  groupByPattern,
} from '../../utils/sentences'
import { SentenceLine } from './ColoredSegment'

type SentenceStudyProps = {
  cards: SentenceCard[]
  onBack: () => void
}

function PatternExample({ card, partner }: { card: SentenceCard; partner?: SentenceCard }) {
  const info = PATTERN_INFO[card.pattern]
  return (
    <article className="study-pattern-card">
      <h3>{info.title}</h3>
      <p className="study-pattern-card__desc">{info.description}</p>
      <div className="study-pattern-card__block">
        <p className="study-pattern-card__label">
          {card.role === 'question' ? 'Question' : 'Answer'} · {card.english}
        </p>
        <SentenceLine card={card} order={card.correctOrder} showEnglish />
      </div>
      {partner && (
        <div className="study-pattern-card__block">
          <p className="study-pattern-card__label">
            {partner.role === 'question' ? 'Question' : 'Answer'} · {partner.english}
          </p>
          <SentenceLine card={partner} order={partner.correctOrder} showEnglish />
        </div>
      )}
    </article>
  )
}

export function SentenceStudy({ cards, onBack }: SentenceStudyProps) {
  const examples = useMemo(() => {
    const byPattern = groupByPattern(cards)
    const result: { pattern: PatternId; card: SentenceCard; partner?: SentenceCard }[] = []

    for (const [pattern, list] of byPattern) {
      const card = list[Math.floor(Math.random() * list.length)]
      const pair = getPairCards(cards, card.pairId).filter((c) => c.id !== card.id)
      const partner = pair.length > 0 ? pair[0] : undefined
      result.push({ pattern, card, partner })
    }

    return result.sort((a, b) => a.pattern.localeCompare(b.pattern))
  }, [cards])

  return (
    <div className="app app--wide">
      <header className="header header--row">
        <div>
          <h1>Study</h1>
          <p className="subtitle">One example per sentence pattern</p>
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
          <span className="segment-chip segment-chip--other segment-chip--sample">other</span>
          <span className="study-legend__note">time, question word, place…</span>
        </span>
      </div>

      <div className="study-patterns">
        {examples.map(({ pattern, card, partner }) => (
          <PatternExample key={pattern} card={card} partner={partner} />
        ))}
      </div>
    </div>
  )
}
