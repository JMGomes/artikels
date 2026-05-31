import type { PronounKey, VerbEntry } from '../../types/verb'
import { TABLE_PRONOUN_ROWS, getTableRowForm } from '../../utils/verbs'

type ConjugationTableProps = {
  verb: VerbEntry
  /** Pronouns asked in this round — highlighted in the table */
  testedPronouns?: PronounKey[]
  /** Pronouns the user got wrong */
  wrongPronouns?: PronounKey[]
}

function rowMatches(keys: PronounKey[], pronouns: Set<PronounKey>): boolean {
  return keys.some((key) => pronouns.has(key))
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
          {TABLE_PRONOUN_ROWS.map((row) => {
            const isTested = rowMatches(row.keys, tested)
            const isWrong = rowMatches(row.keys, wrong)
            const rowClass = [
              isTested ? 'conjugation-table__row--tested' : '',
              isWrong ? 'conjugation-table__row--wrong' : '',
              isTested && !isWrong ? 'conjugation-table__row--correct' : '',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <tr key={row.id} className={rowClass || undefined}>
                <td>{row.label}</td>
                <td>{getTableRowForm(verb, row.keys)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
