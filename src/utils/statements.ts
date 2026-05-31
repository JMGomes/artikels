import type {
  PatternFamily,
  StatementCard,
  StatementPatternId,
  StatementSegment,
} from '../types/statement'
import { shuffle } from '../utils'

export const PATTERN_FAMILY_INFO: Record<
  PatternFamily,
  { title: string; description: string }
> = {
  A: {
    title: 'Subject first',
    description: 'Subject · verb · (gern/oft) · object or time.',
  },
  B: {
    title: 'Time first (verb in position 2)',
    description: 'Time adverb first, then verb, then subject and the rest.',
  },
  C: {
    title: 'Negation (nicht) — fixed scope',
    description: 'One correct position for nicht per sentence; read the English carefully.',
  },
  D: {
    title: 'Modifiers (auch, gern, nicht)',
    description: 'Fixed order: auch → nicht → gern in the middle field.',
  },
  E: {
    title: 'Different subjects',
    description: 'Same patterns with ich, du, er, wir, ihr — verb already matches the subject.',
  },
  F: {
    title: 'Special patterns',
    description: 'Coming later (e.g. hobby sentences).',
  },
}

export const STATEMENT_PATTERN_INFO: Record<
  StatementPatternId,
  { title: string; description: string }
> = {
  subject_first_simple: {
    title: 'Subject · Verb · …',
    description: 'Statement begins with the subject.',
  },
  time_first_v2: {
    title: 'Time · Verb · Subject · …',
    description: 'Time first; conjugated verb in position 2.',
  },
  time_nicht_scope: {
    title: 'Sentence with nicht',
    description: 'nicht position changes what is negated — one order per card.',
  },
  modifiers_chain: {
    title: 'auch / nicht / gern',
    description: 'Modifier chain in the Mittelfeld.',
  },
}

export async function loadStatements(): Promise<StatementCard[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}statements.json`)
  if (!response.ok) {
    throw new Error('Could not load statements.')
  }
  return response.json() as Promise<StatementCard[]>
}

export function groupByPatternFamily(
  cards: StatementCard[],
): Map<PatternFamily, StatementCard[]> {
  const map = new Map<PatternFamily, StatementCard[]>()
  for (const card of cards) {
    const list = map.get(card.patternFamily) ?? []
    list.push(card)
    map.set(card.patternFamily, list)
  }
  return map
}

export function renderGermanStatement(card: StatementCard, order: string[]): string {
  const byId = new Map(card.segments.map((s) => [s.id, s]))
  return order.map((id) => byId.get(id)?.text ?? '').join(' ')
}

export function getAcceptedOrders(card: StatementCard): string[][] {
  return [card.correctOrder, ...(card.alternateOrders ?? [])]
}

export function gradeStatementOrder(card: StatementCard, userOrder: string[]): boolean {
  const allOrders = getAcceptedOrders(card)
  return allOrders.some(
    (expected) =>
      expected.length === userOrder.length &&
      expected.every((id, i) => id === userOrder[i]),
  )
}

export function segmentBankKey(text: string): string {
  return text.trim().toLowerCase()
}

export function buildStatementSegmentBank(
  card: StatementCard,
  allCards: StatementCard[],
  extraDistractors = 2,
): StatementSegment[] {
  const pool = new Map<string, StatementSegment>()
  const seenText = new Set<string>()

  for (const seg of card.segments) {
    pool.set(seg.id, seg)
    seenText.add(segmentBankKey(seg.text))
  }

  const addDistractor = (seg: StatementSegment) => {
    if (pool.has(seg.id)) return
    const key = segmentBankKey(seg.text)
    if (seenText.has(key)) return
    pool.set(seg.id, seg)
    seenText.add(key)
  }

  if (card.distractors) {
    for (const id of card.distractors) {
      const found = allCards.flatMap((c) => c.segments).find((s) => s.id === id)
      if (found) addDistractor(found)
    }
  }

  const others = shuffle(
    allCards.filter((c) => c.id !== card.id).flatMap((c) => c.segments),
  )
  for (const seg of others) {
    if (pool.size >= card.segments.length + extraDistractors) break
    addDistractor(seg)
  }

  return shuffle([...pool.values()])
}

/** Pick rounds spread across pattern families (A, B, C, D, E). */
export function pickPracticeStatements(
  cards: StatementCard[],
  count: number,
): StatementCard[] {
  const eligible = cards.filter((c) => c.patternFamily !== 'F' && c.segments.length >= 3)
  const byFamily = groupByPatternFamily(eligible)
  const families = shuffle([...byFamily.keys()])
  const picked: StatementCard[] = []
  const usedIds = new Set<string>()

  for (const family of families) {
    if (picked.length >= count) break
    const list = byFamily.get(family) ?? []
    const card = list[Math.floor(Math.random() * list.length)]
    if (card && !usedIds.has(card.id)) {
      picked.push(card)
      usedIds.add(card.id)
    }
  }

  const remaining = shuffle(eligible.filter((c) => !usedIds.has(c.id)))
  for (const card of remaining) {
    if (picked.length >= count) break
    picked.push(card)
    usedIds.add(card.id)
  }

  return shuffle(picked).slice(0, Math.min(count, picked.length))
}

export function formatSlotRow(slotOrder: string): string[] {
  return slotOrder.split('·').map((s) => s.trim())
}
