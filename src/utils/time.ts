import type { TimePair } from '../types/time'
import { shuffle } from '../utils'

export const ALLOWED_MINUTES = [3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 57] as const

export const PAIRS_PER_TIME_SESSION = 4

const HOUR_WORD: Record<number, string> = {
  1: 'eins',
  2: 'zwei',
  3: 'drei',
  4: 'vier',
  5: 'fünf',
  6: 'sechs',
  7: 'sieben',
  8: 'acht',
  9: 'neun',
  10: 'zehn',
  11: 'elf',
  12: 'zwölf',
  13: 'dreizehn',
  14: 'vierzehn',
  15: 'fünfzehn',
  16: 'sechzehn',
  17: 'siebzehn',
  18: 'achtzehn',
  19: 'neunzehn',
  20: 'zwanzig',
  21: 'einundzwanzig',
  22: 'zweiundzwanzig',
  23: 'dreiundzwanzig',
}

/** Hour used in “halb …” / “vor halb …” (the next full hour). */
function hourHalbTarget(hour: number): string {
  if (hour === 23) return 'null'
  return HOUR_WORD[hour + 1]
}

/** Hour used in “… vor …” (the upcoming hour). */
function hourVorTarget(hour: number): string {
  return hourHalbTarget(hour)
}

function hourNach(hour: number): string {
  return HOUR_WORD[hour]
}

export function formatDigitalTime(hour: number, minute: number): string {
  return `${hour}:${String(minute).padStart(2, '0')} Uhr`
}

export function formatGermanTime(hour: number, minute: number): string {
  const nach = hourNach(hour)
  const vor = hourVorTarget(hour)
  const halb = hourHalbTarget(hour)

  switch (minute) {
    case 3:
      return `kurz nach ${nach}`
    case 5:
      return `fünf nach ${nach}`
    case 10:
      return `zehn nach ${nach}`
    case 15:
      return `Viertel nach ${nach}`
    case 20:
      return `zwanzig nach ${nach}`
    case 25:
      return `fünf vor halb ${halb}`
    case 30:
      return `halb ${halb}`
    case 35:
      return `fünf nach halb ${halb}`
    case 40:
      return `zwanzig vor ${vor}`
    case 45:
      return `Viertel vor ${vor}`
    case 50:
      return `zehn vor ${vor}`
    case 55:
      return `fünf vor ${vor}`
    case 57:
      return `kurz vor ${vor}`
    default:
      return formatDigitalTime(hour, minute)
  }
}

function randomHour(): number {
  return 1 + Math.floor(Math.random() * 23)
}

function randomMinute(): (typeof ALLOWED_MINUTES)[number] {
  return ALLOWED_MINUTES[Math.floor(Math.random() * ALLOWED_MINUTES.length)]
}

export function buildTimePair(hour: number, minute: number): TimePair {
  return {
    id: `${hour}-${minute}`,
    hour,
    minute,
    digital: formatDigitalTime(hour, minute),
    german: formatGermanTime(hour, minute),
  }
}

export function generateTimeSession(count = PAIRS_PER_TIME_SESSION): TimePair[] {
  const seen = new Set<string>()
  const pairs: TimePair[] = []
  let guard = 0

  while (pairs.length < count && guard < 500) {
    guard += 1
    const hour = randomHour()
    const minute = randomMinute()
    const key = `${hour}-${minute}`
    if (seen.has(key)) continue
    seen.add(key)
    pairs.push(buildTimePair(hour, minute))
  }

  return pairs
}

export function shuffleTimePairs(pairs: TimePair[]): TimePair[] {
  return shuffle(pairs)
}
