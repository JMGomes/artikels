import type { PronounKey, VerbEntry } from '../../types/verb'
import { PRONOUN_LABELS, PRONOUN_ORDER } from '../../utils/verbs'

type ConjugationTableProps = {
  verb: VerbEntry
  /** Pronouns asked in this round — highlighted in the table */
  testedPronouns?: PronounKey[]
  /** Pronouns the user got wrong */
  wrongPronouns?: PronounKey[]
}

export function ConjugationTable({
  verb,
  testedPronouns = [],
  wrongPronouns = [],
}: ConjugationTableProps) {
  const tested = new Set(testedPronouns)
  const wrong = new Set(wrongPronouns)

  return (
    <div className="conjugation-table-wrap">
      <p className="conjugation-table__title">
        <strong>{verb.infinitive}</strong> — {verb.english}
      </p>
      <table className="conjugation-table">
        <thead>
          <tr>
            <th>Pronoun</th>
            <th>Form</th>
          </tr>
        </thead>
        <tbody>
          {PRONOUN_ORDER.map((key) => {
            const rowClass = [
              tested.has(key) ? 'conjugation-table__row--tested' : '',
              wrong.has(key) ? 'conjugation-table__row--wrong' : '',
              tested.has(key) && !wrong.has(key) ? 'conjugation-table__row--correct' : '',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <tr key={key} className={rowClass || undefined}>
                <td>{PRONOUN_LABELS[key]}</td>
                <td>{verb.present[key]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
