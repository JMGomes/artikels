import type { PatternId, Segment, SentenceCard } from '../types/sentence'
import { shuffle } from '../utils'

export const PATTERN_INFO: Record<
  PatternId,
  { title: string; description: string }
> = {
  time_first_v2: {
    title: 'Time first (verb in position 2)',
    description: 'Time adverbial first, then the conjugated verb, then the subject.',
  },
  subject_first: {
    title: 'Subject first',
    description: 'Subject + verb + time and place complements.',
  },
  w_question_wann: {
    title: 'Wann-question',
    description: 'Wann + verb + subject + rest.',
  },
  w_question_was: {
    title: 'Was-question',
    description: 'Was + verb + subject + rest.',
  },
  w_question_wann_was: {
    title: 'Wann … was?',
    description: 'Wann + verb + subject + was.',
  },
  w_question_was_wann: {
    title: 'Was … wann?',
    description: 'Was + verb + subject + wann.',
  },
  pronoun_er_statement: {
    title: 'Statement with er',
    description: 'Answer with pronoun er instead of the name.',
  },
  pronoun_ich_statement: {
    title: 'Statement with ich',
    description: 'First person: ich + verb or time + verb + ich.',
  },
  coordination_und: {
    title: 'Coordination with und',
    description: 'Two activities joined with und.',
  },
  connector_dann: {
    title: 'Connector dann',
    description: 'Dann + verb: the next action in sequence.',
  },
}

export async function loadSentences(): Promise<SentenceCard[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}sentences.json`)
  if (!response.ok) {
    throw new Error('Could not load sentences.')
  }
  return response.json() as Promise<SentenceCard[]>
}

export function groupByPattern(cards: SentenceCard[]): Map<PatternId, SentenceCard[]> {
  const map = new Map<PatternId, SentenceCard[]>()
  for (const card of cards) {
    const list = map.get(card.pattern) ?? []
    list.push(card)
    map.set(card.pattern, list)
  }
  return map
}

export function pickOnePerPattern(cards: SentenceCard[]): SentenceCard[] {
  const byPattern = groupByPattern(cards)
  return [...byPattern.values()].map((list) => list[Math.floor(Math.random() * list.length)])
}

export function getPairCards(cards: SentenceCard[], pairId: string): SentenceCard[] {
  return cards.filter((c) => c.pairId === pairId)
}

export function gradeOrder(
  card: SentenceCard,
  userOrder: string[],
): boolean {
  const allOrders = [card.correctOrder, ...(card.alternateOrders ?? [])]
  return allOrders.some(
    (expected) =>
      expected.length === userOrder.length &&
      expected.every((id, i) => id === userOrder[i]),
  )
}

export function buildSegmentBank(
  card: SentenceCard,
  allCards: SentenceCard[],
  extraDistractors = 2,
): Segment[] {
  const pool = new Map<string, Segment>()
  for (const seg of card.segments) {
    pool.set(seg.id, seg)
  }
  if (card.distractors) {
    for (const id of card.distractors) {
      const found = allCards.flatMap((c) => c.segments).find((s) => s.id === id)
      if (found) pool.set(found.id, found)
    }
  }
  const others = shuffle(
    allCards.filter((c) => c.id !== card.id).flatMap((c) => c.segments),
  )
  for (const seg of others) {
    if (pool.size >= card.segments.length + extraDistractors) break
    if (!pool.has(seg.id)) pool.set(seg.id, seg)
  }
  return shuffle([...pool.values()])
}

export function pickPracticeRound(
  cards: SentenceCard[],
  count: number,
): SentenceCard[] {
  const eligible = cards.filter((c) => c.segments.length >= 4)
  return shuffle(eligible).slice(0, Math.min(count, eligible.length))
}

export function renderOrderedText(card: SentenceCard, order: string[]): string {
  const byId = new Map(card.segments.map((s) => [s.id, s]))
  return order.map((id) => byId.get(id)?.text ?? '').join(' ')
}
