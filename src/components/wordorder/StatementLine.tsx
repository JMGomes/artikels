import type { StatementCard } from '../../types/statement'
import { ColoredSegment } from '../sentences/ColoredSegment'

export function StatementLine({
  card,
  order,
  showEnglish = false,
}: {
  card: StatementCard
  order: string[]
  showEnglish?: boolean
}) {
  const byId = new Map(card.segments.map((s) => [s.id, s]))
  return (
    <p className="sentence-line">
      {order.map((id, i) => {
        const seg = byId.get(id)
        if (!seg) return null
        return (
          <span key={id} className="sentence-line__piece">
            {i > 0 ? ' ' : ''}
            <ColoredSegment segment={seg} showEnglish={showEnglish} />
          </span>
        )
      })}
    </p>
  )
}
