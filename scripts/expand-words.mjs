import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const filePath = path.join(__dirname, '../public/words.json')

/** @type {Array<{germanWord:string,englishTranslation:string,artikel:'der'|'die'|'das',pluralForm:string}>} */
const additions = [
  // School / office supplies
  ['Federmäppchen', 'pencil case', 'das', 'die Federmäppchen'],
  ['Buntstift', 'colored pencil', 'der', 'die Buntstifte'],
  ['Spitzer', 'pencil sharpener', 'der', 'die Spitzer'],
  ['Radiergummi', 'eraser', 'der', 'die Radiergummis'],
  ['Patrone', 'ink cartridge', 'die', 'die Patronen'],
  ['Kuli', 'pen (colloquial)', 'der', 'die Kulis'],
  ['Lineal', 'ruler', 'das', 'die Lineale'],
  ['Schere', 'scissors', 'die', 'die Scheren'],
  ['Smartphone', 'smartphone', 'das', 'die Smartphones'],

  // Family & relationships
  ['Familie', 'family', 'die', 'die Familien'],
  ['Großeltern', 'grandparents', 'die', 'die Großeltern'],
  ['Ehepaar', 'married couple', 'das', 'die Ehepaare'],
  ['Kuscheltier', 'stuffed animal', 'das', 'die Kuscheltiere'],
  ['Teddybär', 'teddy bear', 'der', 'die Teddybären'],

  // Food & shopping
  ['Flasche', 'bottle', 'die', 'die Flaschen'],
  ['Zitrone', 'lemon', 'die', 'die Zitronen'],
  ['Limo', 'soft drink / lemonade', 'die', 'die Limos'],
  ['Apfelsaft', 'apple juice', 'der', 'die Apfelsäfte'],
  ['Tüte', 'bag', 'die', 'die Tüten'],
  ['Einkauf', 'shopping / purchase', 'der', 'die Einkäufe'],
  ['Gurke', 'cucumber', 'die', 'die Gurken'],
  ['Spaghetti', 'spaghetti', 'die', 'die Spaghetti'],
  ['Tomatensoße', 'tomato sauce', 'die', 'die Tomatensoßen'],
  ['Tomatensuppe', 'tomato soup', 'die', 'die Tomatensuppen'],
  ['Basilikum', 'basil', 'der', '(no plural)'],
  ['Petersilie', 'parsley', 'die', '(no plural)'],
  ['Metzger', 'butcher', 'der', 'die Metzger'],
  ['Metzgerei', 'butcher shop', 'die', 'die Metzgereien'],
  ['Gemüsegeschäft', 'greengrocer', 'das', 'die Gemüsegeschäfte'],
  ['Waage', 'scale', 'die', 'die Waagen'],
  ['Lebensmittel', 'groceries / foodstuffs', 'die', 'die Lebensmittel'],
  ['Einkaufswagen', 'shopping cart', 'der', 'die Einkaufswagen'],
  ['Kasse', 'checkout / cash register', 'die', 'die Kassen'],
  ['Frühstück', 'breakfast', 'das', 'die Frühstücke'],
  ['Mittagessen', 'lunch', 'das', 'die Mittagessen'],
  ['Abendessen', 'dinner', 'das', 'die Abendessen'],

  // Daily life
  ['Wecker', 'alarm clock', 'der', 'die Wecker'],
  ['Seife', 'soap', 'die', 'die Seifen'],
  ['Dusche', 'shower', 'die', 'die Duschen'],
  ['Kopfhörer', 'headphones', 'der', 'die Kopfhörer'],
  ['Büro', 'office', 'das', 'die Büros'],
  ['Fernseher', 'television', 'der', 'die Fernseher'],
  ['Kissen', 'pillow', 'das', 'die Kissen'],
  ['Zeitung', 'newspaper', 'die', 'die Zeitungen'],
  ['Kino', 'cinema', 'das', 'die Kinos'],
  ['Jahreszeit', 'season (of the year)', 'die', 'die Jahreszeiten'],

  // Jobs
  ['Bauarbeiter', 'construction worker', 'der', 'die Bauarbeiter'],
  ['Mitarbeiter', 'employee', 'der', 'die Mitarbeiter'],
  ['Verkäuferin', 'saleswoman', 'die', 'die Verkäuferinnen'],
  ['Kellner', 'waiter', 'der', 'die Kellner'],
  ['Bedienung', 'service / waitstaff', 'die', 'die Bedienungen'],
  ['Köchin', 'cook (female)', 'die', 'die Köchinnen'],
  ['Krankenschwester', 'nurse', 'die', 'die Krankenschwestern'],
  ['Mechaniker', 'mechanic', 'der', 'die Mechaniker'],
  ['Putzfrau', 'cleaner (female)', 'die', 'die Putzfrauen'],
  ['Hausmeister', 'caretaker / janitor', 'der', 'die Hausmeister'],
  ['Rezeptionist', 'receptionist (male)', 'der', 'die Rezeptionisten'],
  ['Sekretärin', 'secretary (female)', 'die', 'die Sekretärinnen'],

  // Health
  ['Körperteil', 'body part', 'der', 'die Körperteile'],
  ['Tablette', 'tablet / pill', 'die', 'die Tabletten'],
  ['Medizin', 'medicine', 'die', 'die Medizinen'],
  ['Pflaster', 'bandage / plaster', 'das', 'die Pflaster'],
  ['Husten', 'cough', 'der', '(no plural)'],
  ['Fieber', 'fever', 'das', '(no plural)'],
  ['Schnupfen', 'cold (illness)', 'der', '(no plural)'],
  ['Taschentuch', 'tissue', 'das', 'die Taschentücher'],
  ['Zahnschmerzen', 'toothache', 'die', 'die Zahnschmerzen'],
  ['Bauchschmerzen', 'stomach ache', 'die', 'die Bauchschmerzen'],
  ['Kopfschmerzen', 'headache', 'die', 'die Kopfschmerzen'],
  ['Halsweh', 'sore throat', 'das', '(no plural)'],
  ['Rückenschmerzen', 'backache', 'die', 'die Rückenschmerzen'],
  ['Apothekerin', 'pharmacist (female)', 'die', 'die Apothekerinnen'],
  ['Krankenpfleger', 'nurse (male)', 'der', 'die Krankenpfleger'],

  // Clothing & colors
  ['Farbe', 'color', 'die', 'die Farben'],
  ['Kaufhaus', 'department store', 'das', 'die Kaufhäuser'],
  ['Geschäft', 'shop / store', 'das', 'die Geschäfte'],
  ['Rolltreppe', 'escalator', 'die', 'die Rolltreppen'],
  ['Leute', 'people', 'die', 'die Leute'],
  ['Anorak', 'anorak / windbreaker', 'der', 'die Anoraks'],
  ['Pulli', 'sweater (colloquial)', 'der', 'die Pullis'],
  ['Bluse', 'blouse', 'die', 'die Blusen'],
  ['Windel', 'diaper', 'die', 'die Windeln'],
  ['Anzug', 'suit', 'der', 'die Anzüge'],
  ['Jackett', 'sports coat', 'das', 'die Jacketts'],
  ['Krawatte', 'tie', 'die', 'die Krawatten'],
  ['Unterhose', 'underpants', 'die', 'die Unterhosen'],
  ['Strumpf', 'stocking', 'der', 'die Strümpfe'],
  ['Strumpfhose', 'tights', 'die', 'die Strumpfhosen'],
  ['Gürtel', 'belt', 'der', 'die Gürtel'],
  ['Handschuh', 'glove', 'der', 'die Handschuhe'],

  // Transport & city
  ['Kinderwagen', 'stroller / pram', 'der', 'die Kinderwagen'],
  ['Anzeige', 'display / sign', 'die', 'die Anzeigen'],
  ['S-Bahn', 'suburban train', 'die', 'die S-Bahnen'],
  ['Kreuzung', 'intersection', 'die', 'die Kreuzungen'],
  ['Zebrastreifen', 'pedestrian crossing', 'der', 'die Zebrastreifen'],
  ['Fußgänger', 'pedestrian', 'der', 'die Fußgänger'],
  ['Ampel', 'traffic light', 'die', 'die Ampeln'],
  ['Ecke', 'corner', 'die', 'die Ecken'],
  ['Stadtplan', 'city map', 'der', 'die Stadtpläne'],

  // Colors (substantivated)
  ['Schwarz', 'black', 'das', '(no plural)'],
  ['Grau', 'gray', 'das', '(no plural)'],
  ['Weiß', 'white', 'das', '(no plural)'],
  ['Rot', 'red', 'das', '(no plural)'],
  ['Grün', 'green', 'das', '(no plural)'],
  ['Gelb', 'yellow', 'das', '(no plural)'],
  ['Blau', 'blue', 'das', '(no plural)'],
  ['Braun', 'brown', 'das', '(no plural)'],

  ['Verkäufer', 'salesman', 'der', 'die Verkäufer'],
]

function normKey(word) {
  return word
    .toLowerCase()
    .replace(/\s*\([^)]*\)/g, '')
    .trim()
}

const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'))
const byKey = new Map()
for (const w of existing) {
  byKey.set(normKey(w.germanWord), w)
}

let added = 0
for (const [germanWord, englishTranslation, artikel, pluralForm] of additions) {
  const key = normKey(germanWord)
  if (byKey.has(key)) continue
  const entry = { germanWord, englishTranslation, artikel, pluralForm }
  byKey.set(key, entry)
  added++
}

const merged = [...byKey.values()].sort((a, b) =>
  a.germanWord.localeCompare(b.germanWord, 'de'),
)

fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n')
console.log('Before:', existing.length)
console.log('Added:', added)
console.log('After:', merged.length)
