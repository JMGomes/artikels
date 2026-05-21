import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const filePath = path.join(__dirname, '../public/sentences.json')

const QUESTION_WORDS = new Set([
  'wann', 'was', 'wer', 'wo', 'wohin', 'wie',
  'Wann', 'Was', 'Wer', 'Wo', 'Wohin', 'Wie',
])

function inferType(text, current) {
  if (current === 'subject' || current === 'verb') return current
  const t = text.trim()
  if (QUESTION_WORDS.has(t)) return 'questionWord'
  if (
    /^(Am|Im)\s/.test(text) ||
    /^am (Morgen|Vormittag|Nachmittag|Abend|Mittag|Sonntag|Wochenende)\b/.test(text) ||
    /^zu Mittag\b/.test(text) ||
    /^(heute|morgen)$/i.test(t)
  ) return 'time'
  if (
    /^im\s/i.test(text) ||
    /^in der\s/i.test(text) ||
    /^ins\s/i.test(text) ||
    /^in die\s/i.test(text) ||
    /^zum\s/i.test(text) ||
    /^zur\s/i.test(text) ||
    /^nach\s/i.test(text) ||
    /^zu Hause$/i.test(text)
  ) return 'place'
  return 'other'
}

function migrateCard(card) {
  for (const seg of card.segments) {
    seg.type = inferType(seg.text, seg.type)
  }
  return card
}

function seg(id, text, english, type) {
  return { id, text, english, type }
}

function card(def) {
  def.segments = def.segments.map((s) =>
    seg(s.id, s.text, s.english, s.type || inferType(s.text, 'other')),
  )
  return def
}

const existing = JSON.parse(fs.readFileSync(filePath, 'utf8')).map(migrateCard)

const newCards = [
  // Phase 1: more pairs, existing patterns
  card({
    id: 'kaan-mensa-q',
    pairId: 'kaan-mensa',
    role: 'question',
    pattern: 'w_question_was',
    english: 'What does Kaan eat at noon?',
    segments: [
      ['km-q1', 'Was', 'What', 'questionWord'],
      ['km-q2', 'isst', 'eats', 'verb'],
      ['km-q3', 'Kaan', 'Kaan', 'subject'],
      ['km-q4', 'am Mittag', 'at noon', 'time'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['km-q1', 'km-q2', 'km-q3', 'km-q4'],
  }),
  card({
    id: 'kaan-mensa-a',
    pairId: 'kaan-mensa',
    role: 'answer',
    pattern: 'time_first_v2',
    english: 'At noon he eats in the canteen.',
    segments: [
      ['km-a1', 'Am Mittag', 'At noon', 'time'],
      ['km-a2', 'isst', 'eats', 'verb'],
      ['km-a3', 'er', 'he', 'subject'],
      ['km-a4', 'in der Mensa', 'in the canteen', 'place'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['km-a1', 'km-a2', 'km-a3', 'km-a4'],
    alternateOrders: [['km-a3', 'km-a2', 'km-a4', 'km-a1']],
  }),
  card({
    id: 'kaan-vormittag-was-a',
    pairId: 'kaan-vormittag-was',
    role: 'answer',
    pattern: 'pronoun_er_statement',
    english: 'He rides his bike to the university in the morning.',
    segments: [
      ['kvw-a1', 'Er', 'He', 'subject'],
      ['kvw-a2', 'fährt', 'rides / goes', 'verb'],
      ['kvw-a3', 'am Vormittag', 'in the morning', 'time'],
      ['kvw-a4', 'mit dem Fahrrad', 'by bike', 'other'],
      ['kvw-a5', 'in die Uni', 'to the university', 'place'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['kvw-a1', 'kvw-a2', 'kvw-a3', 'kvw-a4', 'kvw-a5'],
  }),
  card({
    id: 'wir-mensa-q',
    pairId: 'wir-mensa',
    role: 'question',
    pattern: 'w_question_wann',
    english: 'When do we go to the canteen?',
    segments: [
      ['wm-q1', 'Wann', 'When', 'questionWord'],
      ['wm-q2', 'gehen', 'go', 'verb'],
      ['wm-q3', 'wir', 'we', 'subject'],
      ['wm-q4', 'in die Mensa', 'to the canteen', 'place'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['wm-q1', 'wm-q2', 'wm-q3', 'wm-q4'],
  }),
  card({
    id: 'wir-mensa-a',
    pairId: 'wir-mensa',
    role: 'answer',
    pattern: 'pronoun_wir_statement',
    english: 'We go to the canteen at noon.',
    segments: [
      ['wm-a1', 'Wir', 'We', 'subject'],
      ['wm-a2', 'gehen', 'go', 'verb'],
      ['wm-a3', 'am Mittag', 'at noon', 'time'],
      ['wm-a4', 'in die Mensa', 'to the canteen', 'place'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['wm-a1', 'wm-a2', 'wm-a3', 'wm-a4'],
    alternateOrders: [['wm-a3', 'wm-a2', 'wm-a1', 'wm-a4']],
  }),
  card({
    id: 'marie-tee-q',
    pairId: 'marie-tee',
    role: 'question',
    pattern: 'w_question_was',
    english: 'What does Marie drink?',
    segments: [
      ['mt-q1', 'Was', 'What', 'questionWord'],
      ['mt-q2', 'trinkt', 'drinks', 'verb'],
      ['mt-q3', 'Marie', 'Marie', 'subject'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['mt-q1', 'mt-q2', 'mt-q3'],
  }),
  card({
    id: 'marie-tee-a',
    pairId: 'marie-tee',
    role: 'answer',
    pattern: 'pronoun_sie_statement',
    english: 'She drinks tea in the afternoon.',
    segments: [
      ['mt-a1', 'Sie', 'She', 'subject'],
      ['mt-a2', 'trinkt', 'drinks', 'verb'],
      ['mt-a3', 'am Nachmittag', 'in the afternoon', 'time'],
      ['mt-a4', 'Tee', 'tea', 'other'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['mt-a1', 'mt-a2', 'mt-a3', 'mt-a4'],
    alternateOrders: [['mt-a3', 'mt-a2', 'mt-a1', 'mt-a4']],
  }),
  card({
    id: 'kaan-supermarkt-q',
    pairId: 'kaan-supermarkt',
    role: 'question',
    pattern: 'w_question_was',
    english: 'What does Kaan buy at the supermarket?',
    segments: [
      ['ks-q1', 'Was', 'What', 'questionWord'],
      ['ks-q2', 'kauft', 'buys', 'verb'],
      ['ks-q3', 'Kaan', 'Kaan', 'subject'],
      ['ks-q4', 'im Supermarkt', 'at the supermarket', 'place'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['ks-q1', 'ks-q2', 'ks-q3', 'ks-q4'],
  }),
  card({
    id: 'kaan-supermarkt-a',
    pairId: 'kaan-supermarkt',
    role: 'answer',
    pattern: 'pronoun_er_statement',
    english: 'He buys bread at the supermarket.',
    segments: [
      ['ks-a1', 'Er', 'He', 'subject'],
      ['ks-a2', 'kauft', 'buys', 'verb'],
      ['ks-a3', 'Brot', 'bread', 'other'],
      ['ks-a4', 'im Supermarkt', 'at the supermarket', 'place'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['ks-a1', 'ks-a2', 'ks-a3', 'ks-a4'],
    alternateOrders: [['ks-a4', 'ks-a2', 'ks-a1', 'ks-a3']],
  }),
  card({
    id: 'du-abend-q',
    pairId: 'du-abend',
    role: 'question',
    pattern: 'w_question_wohin',
    english: 'Where are you going this evening?',
    segments: [
      ['da-q1', 'Wohin', 'Where to', 'questionWord'],
      ['da-q2', 'gehst', 'go', 'verb'],
      ['da-q3', 'du', 'you', 'subject'],
      ['da-q4', 'am Abend', 'this evening', 'time'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['da-q1', 'da-q2', 'da-q3', 'da-q4'],
  }),
  card({
    id: 'du-abend-a',
    pairId: 'du-abend',
    role: 'answer',
    pattern: 'pronoun_du_statement',
    english: 'You are going to the cinema in the evening.',
    segments: [
      ['da-a1', 'Du', 'You', 'subject'],
      ['da-a2', 'gehst', 'go', 'verb'],
      ['da-a3', 'am Abend', 'in the evening', 'time'],
      ['da-a4', 'ins Kino', 'to the cinema', 'place'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['da-a1', 'da-a2', 'da-a3', 'da-a4'],
    alternateOrders: [['da-a3', 'da-a2', 'da-a1', 'da-a4']],
  }),

  // Phase 2: Wo, Wohin, Wer, Wie
  card({
    id: 'wohnen-wo-q',
    pairId: 'wohnen-wo',
    role: 'question',
    pattern: 'w_question_wo',
    english: 'Where does Kaan live?',
    segments: [
      ['ww-q1', 'Wo', 'Where', 'questionWord'],
      ['ww-q2', 'wohnt', 'lives', 'verb'],
      ['ww-q3', 'Kaan', 'Kaan', 'subject'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['ww-q1', 'ww-q2', 'ww-q3'],
  }),
  card({
    id: 'wohnen-wo-a',
    pairId: 'wohnen-wo',
    role: 'answer',
    pattern: 'pronoun_er_statement',
    english: 'He lives in Berlin.',
    segments: [
      ['ww-a1', 'Er', 'He', 'subject'],
      ['ww-a2', 'wohnt', 'lives', 'verb'],
      ['ww-a3', 'in Berlin', 'in Berlin', 'place'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['ww-a1', 'ww-a2', 'ww-a3'],
    alternateOrders: [['ww-a3', 'ww-a2', 'ww-a1']],
  }),
  card({
    id: 'abend-wohin-q',
    pairId: 'abend-wohin',
    role: 'question',
    pattern: 'w_question_wohin',
    english: 'Where is Kaan going in the evening?',
    segments: [
      ['aw-q1', 'Wohin', 'Where to', 'questionWord'],
      ['aw-q2', 'geht', 'goes', 'verb'],
      ['aw-q3', 'Kaan', 'Kaan', 'subject'],
      ['aw-q4', 'am Abend', 'in the evening', 'time'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['aw-q1', 'aw-q2', 'aw-q3', 'aw-q4'],
  }),
  card({
    id: 'abend-wohin-a',
    pairId: 'abend-wohin',
    role: 'answer',
    pattern: 'time_first_v2',
    english: 'In the evening he goes to the cinema.',
    segments: [
      ['aw-a1', 'Am Abend', 'In the evening', 'time'],
      ['aw-a2', 'geht', 'goes', 'verb'],
      ['aw-a3', 'er', 'he', 'subject'],
      ['aw-a4', 'ins Kino', 'to the cinema', 'place'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['aw-a1', 'aw-a2', 'aw-a3', 'aw-a4'],
    alternateOrders: [['aw-a3', 'aw-a2', 'aw-a4', 'aw-a1']],
  }),
  card({
    id: 'wer-marie-q',
    pairId: 'wer-marie',
    role: 'question',
    pattern: 'w_question_wer',
    english: 'Who is Marie?',
    segments: [
      ['wmr-q1', 'Wer', 'Who', 'questionWord'],
      ['wmr-q2', 'ist', 'is', 'verb'],
      ['wmr-q3', 'Marie', 'Marie', 'subject'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['wmr-q1', 'wmr-q2', 'wmr-q3'],
  }),
  card({
    id: 'wer-marie-a',
    pairId: 'wer-marie',
    role: 'answer',
    pattern: 'subject_first',
    english: 'Marie is his friend.',
    segments: [
      ['wmr-a1', 'Marie', 'Marie', 'subject'],
      ['wmr-a2', 'ist', 'is', 'verb'],
      ['wmr-a3', 'seine Freundin', 'his friend (female)', 'other'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['wmr-a1', 'wmr-a2', 'wmr-a3'],
  }),
  card({
    id: 'name-wie-q',
    pairId: 'name-wie',
    role: 'question',
    pattern: 'w_question_wie',
    english: 'What is your name?',
    segments: [
      ['nw-q1', 'Wie', 'How', 'questionWord'],
      ['nw-q2', 'heißt', 'are called', 'verb'],
      ['nw-q3', 'du', 'you', 'subject'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['nw-q1', 'nw-q2', 'nw-q3'],
  }),
  card({
    id: 'name-wie-a',
    pairId: 'name-wie',
    role: 'answer',
    pattern: 'pronoun_ich_statement',
    english: 'My name is Anna.',
    segments: [
      ['nw-a1', 'Ich', 'I', 'subject'],
      ['nw-a2', 'heiße', 'am called', 'verb'],
      ['nw-a3', 'Anna', 'Anna', 'other'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['nw-a1', 'nw-a2', 'nw-a3'],
  }),

  // Phase 3: Restaurant
  card({
    id: 'restaurant-trinken-q',
    pairId: 'restaurant-trinken',
    role: 'question',
    pattern: 'w_question_was',
    english: 'What does Kaan drink in the restaurant?',
    segments: [
      ['rt-q1', 'Was', 'What', 'questionWord'],
      ['rt-q2', 'trinkt', 'drinks', 'verb'],
      ['rt-q3', 'Kaan', 'Kaan', 'subject'],
      ['rt-q4', 'im Restaurant', 'in the restaurant', 'place'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['rt-q1', 'rt-q2', 'rt-q3', 'rt-q4'],
  }),
  card({
    id: 'restaurant-trinken-a',
    pairId: 'restaurant-trinken',
    role: 'answer',
    pattern: 'pronoun_er_statement',
    english: 'He drinks a coffee in the restaurant.',
    segments: [
      ['rt-a1', 'Er', 'He', 'subject'],
      ['rt-a2', 'trinkt', 'drinks', 'verb'],
      ['rt-a3', 'im Restaurant', 'in the restaurant', 'place'],
      ['rt-a4', 'einen Kaffee', 'a coffee', 'other'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['rt-a1', 'rt-a2', 'rt-a3', 'rt-a4'],
    alternateOrders: [['rt-a3', 'rt-a2', 'rt-a1', 'rt-a4']],
  }),
  card({
    id: 'restaurant-essen-q',
    pairId: 'restaurant-essen',
    role: 'question',
    pattern: 'w_question_was',
    english: 'What does Kaan eat in the restaurant?',
    segments: [
      ['re-q1', 'Was', 'What', 'questionWord'],
      ['re-q2', 'isst', 'eats', 'verb'],
      ['re-q3', 'Kaan', 'Kaan', 'subject'],
      ['re-q4', 'im Restaurant', 'in the restaurant', 'place'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['re-q1', 're-q2', 're-q3', 're-q4'],
  }),
  card({
    id: 'restaurant-essen-a',
    pairId: 'restaurant-essen',
    role: 'answer',
    pattern: 'pronoun_er_statement',
    english: 'He eats pizza in the restaurant.',
    segments: [
      ['re-a1', 'Er', 'He', 'subject'],
      ['re-a2', 'isst', 'eats', 'verb'],
      ['re-a3', 'im Restaurant', 'in the restaurant', 'place'],
      ['re-a4', 'Pizza', 'pizza', 'other'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['re-a1', 're-a2', 're-a3', 're-a4'],
    alternateOrders: [['re-a3', 're-a2', 're-a1', 're-a4']],
  }),
  card({
    id: 'restaurant-wo-q',
    pairId: 'restaurant-wo',
    role: 'question',
    pattern: 'w_question_wo',
    english: 'Where does Kaan eat at noon?',
    segments: [
      ['rw-q1', 'Wo', 'Where', 'questionWord'],
      ['rw-q2', 'isst', 'eats', 'verb'],
      ['rw-q3', 'Kaan', 'Kaan', 'subject'],
      ['rw-q4', 'am Mittag', 'at noon', 'time'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['rw-q1', 'rw-q2', 'rw-q3', 'rw-q4'],
  }),
  card({
    id: 'restaurant-wo-a',
    pairId: 'restaurant-wo',
    role: 'answer',
    pattern: 'pronoun_er_statement',
    english: 'He eats in the restaurant.',
    segments: [
      ['rw-a1', 'Er', 'He', 'subject'],
      ['rw-a2', 'isst', 'eats', 'verb'],
      ['rw-a3', 'im Restaurant', 'in the restaurant', 'place'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['rw-a1', 'rw-a2', 'rw-a3'],
    alternateOrders: [['rw-a3', 'rw-a2', 'rw-a1']],
  }),
  card({
    id: 'restaurant-bestellen-q',
    pairId: 'restaurant-bestellen',
    role: 'question',
    pattern: 'w_question_was',
    english: 'What does Kaan order in the restaurant?',
    segments: [
      ['rb-q1', 'Was', 'What', 'questionWord'],
      ['rb-q2', 'bestellt', 'orders', 'verb'],
      ['rb-q3', 'Kaan', 'Kaan', 'subject'],
      ['rb-q4', 'im Restaurant', 'in the restaurant', 'place'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['rb-q1', 'rb-q2', 'rb-q3', 'rb-q4'],
  }),
  card({
    id: 'restaurant-bestellen-a',
    pairId: 'restaurant-bestellen',
    role: 'answer',
    pattern: 'time_first_v2',
    english: 'In the restaurant he orders soup.',
    segments: [
      ['rb-a1', 'Im Restaurant', 'In the restaurant', 'place'],
      ['rb-a2', 'bestellt', 'orders', 'verb'],
      ['rb-a3', 'er', 'he', 'subject'],
      ['rb-a4', 'Suppe', 'soup', 'other'],
    ].map(([id, text, en, type]) => seg(id, text, en, type)),
    correctOrder: ['rb-a1', 'rb-a2', 'rb-a3', 'rb-a4'],
    alternateOrders: [['rb-a3', 'rb-a2', 'rb-a1', 'rb-a4']],
  }),
]

const existingIds = new Set(existing.map((c) => c.id))
const merged = [...existing]
for (const c of newCards) {
  if (!existingIds.has(c.id)) {
    merged.push(c)
    existingIds.add(c.id)
  }
}

// Re-migrate all for place types on legacy "in die" etc.
const final = merged.map(migrateCard)

fs.writeFileSync(filePath, JSON.stringify(final, null, 2))

const byPair = {}
for (const c of final) {
  byPair[c.pairId] = byPair[c.pairId] || { q: 0, a: 0 }
  c.role === 'question' ? byPair[c.pairId].q++ : byPair[c.pairId].a++
}
const practiceable = Object.entries(byPair).filter(([, v]) => v.q && v.a).length
console.log('Total cards:', final.length)
console.log('Practiceable pairs:', practiceable)
console.log('Patterns:', [...new Set(final.map((c) => c.pattern))].sort().join(', '))
