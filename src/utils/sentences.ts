import type {
  PatternId,
  PracticeDirection,
  PracticePair,
  PracticeRound,
  Segment,
  SegmentType,
  SentenceCard,
} from '../types/sentence'
import { shuffle } from '../utils'

const QUESTION_WORDS = new Set([
  'wann',
  'was',
  'wer',
  'wo',
  'wohin',
  'wie',
  'Wann',
  'Was',
  'Wer',
  'Wo',
  'Wohin',
  'Wie',
])

export function inferSegmentType(text: string, current: SegmentType): SegmentType {
  if (current === 'subject' || current === 'verb') return current
  const t = text.trim()
  if (QUESTION_WORDS.has(t)) return 'questionWord'
  if (
    /^(Am|Im)\s/.test(text) ||
    /^am (Morgen|Vormittag|Nachmittag|Abend|Mittag|Sonntag|Wochenende)\b/.test(text) ||
    /^zu Mittag\b/.test(text) ||
    /^(heute|morgen)\b/i.test(t)
  ) {
    return 'time'
  }
  if (
    /^im\s/i.test(text) ||
    /^in der\s/i.test(text) ||
    /^ins\s/i.test(text) ||
    /^in die\s/i.test(text) ||
    /^zum\s/i.test(text) ||
    /^zur\s/i.test(text) ||
    /^nach\s/i.test(text) ||
    /^zu Hause\b/i.test(text)
  ) {
    return 'place'
  }
  return 'other'
}

export function renderGermanSentence(card: SentenceCard, order: string[]): string {
  const byId = new Map(card.segments.map((s) => [s.id, s]))
  return order.map((id) => byId.get(id)?.text ?? '').join(' ')
}

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
  w_question_wo: {
    title: 'Wo-question',
    description: 'Wo + verb + subject (+ place/time).',
  },
  w_question_wohin: {
    title: 'Wohin-question',
    description: 'Wohin + verb + subject (+ time).',
  },
  w_question_wer: {
    title: 'Wer-question',
    description: 'Wer + ist + person or role.',
  },
  w_question_wie: {
    title: 'Wie-question',
    description: 'Wie + verb (+ subject), e.g. Wie heißt du?',
  },
  pronoun_er_statement: {
    title: 'Statement with er',
    description: 'Answer with pronoun er instead of the name.',
  },
  pronoun_sie_statement: {
    title: 'Statement with sie',
    description: 'Answer with pronoun sie (she).',
  },
  pronoun_ich_statement: {
    title: 'Statement with ich',
    description: 'First person: ich + verb or time + verb + ich.',
  },
  pronoun_du_statement: {
    title: 'Statement with du',
    description: 'Second person: du + verb or time + verb + du.',
  },
  pronoun_wir_statement: {
    title: 'Statement with wir',
    description: 'Wir + verb or time + verb + wir.',
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

export function pickPracticePairs(
  cards: SentenceCard[],
  count: number,
): PracticePair[] {
  return pickPracticeRounds(cards, count).map((r) => r.pair)
}

export function pickPracticeRounds(
  cards: SentenceCard[],
  count: number,
): PracticeRound[] {
  const byPair = new Map<string, { questions: SentenceCard[]; answers: SentenceCard[] }>()

  for (const card of cards) {
    if (card.segments.length < 4) continue
    const entry = byPair.get(card.pairId) ?? { questions: [], answers: [] }
    if (card.role === 'question') entry.questions.push(card)
    else entry.answers.push(card)
    byPair.set(card.pairId, entry)
  }

  const rounds: PracticeRound[] = []
  for (const [pairId, { questions, answers }] of byPair) {
    if (questions.length === 0 || answers.length === 0) continue
    const pair: PracticePair = {
      pairId,
      question: questions[Math.floor(Math.random() * questions.length)],
      answer: answers[Math.floor(Math.random() * answers.length)],
    }
    const direction: PracticeDirection =
      Math.random() < 0.5 ? 'buildAnswer' : 'buildQuestion'
    rounds.push({ pair, direction })
  }

  return shuffle(rounds).slice(0, Math.min(count, rounds.length))
}

export function getPromptAndTarget(round: PracticeRound): {
  promptCard: SentenceCard
  targetCard: SentenceCard
  promptLabel: string
  targetLabel: string
  buildInstruction: string
  feedbackWrongLabel: string
} {
  if (round.direction === 'buildAnswer') {
    return {
      promptCard: round.pair.question,
      targetCard: round.pair.answer,
      promptLabel: 'Frage',
      targetLabel: 'Deine Antwort',
      buildInstruction: 'Bilde die Antwort auf Deutsch',
      feedbackWrongLabel: 'Nicht ganz — richtige Antwort:',
    }
  }
  return {
    promptCard: round.pair.answer,
    targetCard: round.pair.question,
    promptLabel: 'Antwort',
    targetLabel: 'Deine Frage',
    buildInstruction: 'Bilde die Frage auf Deutsch',
    feedbackWrongLabel: 'Nicht ganz — richtige Frage:',
  }
}

/** @deprecated Use renderGermanSentence */
export function renderOrderedText(card: SentenceCard, order: string[]): string {
  return renderGermanSentence(card, order)
}
