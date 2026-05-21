import type { Segment } from '../../types/sentence'

type ColoredSegmentProps = {
  segment: Segment
  showEnglish?: boolean
  onClick?: () => void
  used?: boolean
  inBuild?: boolean
  /** Segment is not part of the sentence being built (e.g. distractor). */
  extraneous?: boolean
}

export function ColoredSegment({
  segment,
  showEnglish = false,
  onClick,
  used = false,
  inBuild = false,
  extraneous = false,
}: ColoredSegmentProps) {
  const className = [
    'segment-chip',
    `segment-chip--${segment.type}`,
    onClick ? 'segment-chip--clickable' : '',
    used ? 'segment-chip--used' : '',
    inBuild ? 'segment-chip--build' : '',
    extraneous ? 'segment-chip--extraneous' : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick} disabled={used}>
        <span>{segment.text}</span>
        {showEnglish && <span className="segment-chip__en">{segment.english}</span>}
      </button>
    )
  }

  return (
    <span className={className}>
      <span>{segment.text}</span>
      {showEnglish && <span className="segment-chip__en">{segment.english}</span>}
    </span>
  )
}

export function SentenceLine({
  card,
  order,
  showEnglish = false,
}: {
  card: { segments: Segment[] }
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
