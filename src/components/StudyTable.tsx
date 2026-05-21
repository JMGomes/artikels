import type { Word } from '../types'
import { ColoredArtikel, ColoredPlural } from './ColoredText'

type StudyTableProps = {
  words: Word[]
  onBack: () => void
}

export function StudyTable({ words, onBack }: StudyTableProps) {
  const sorted = [...words].sort((a, b) =>
    a.germanWord.localeCompare(b.germanWord, 'de'),
  )

  return (
    <div className="app app--wide">
      <header className="header header--row">
        <div>
          <h1>Study</h1>
          <p className="subtitle">{words.length} words</p>
        </div>
        <button type="button" className="back-btn" onClick={onBack}>
          ← Menu
        </button>
      </header>

      <div className="study-legend">
        <span>
          <span className="artikel-text artikel-text--der">der</span> masculine
        </span>
        <span>
          <span className="artikel-text artikel-text--die">die</span> feminine
        </span>
        <span>
          <span className="artikel-text artikel-text--das">das</span> neuter
        </span>
        <span>
          <span className="plural-die">die</span> plural
        </span>
      </div>

      <div className="table-wrap">
        <table className="study-table">
          <thead>
            <tr>
              <th>German</th>
              <th>English</th>
              <th>Artikel</th>
              <th>Plural</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((word) => (
              <tr key={word.germanWord}>
                <td className="study-table__word">{word.germanWord}</td>
                <td>{word.englishTranslation}</td>
                <td>
                  <ColoredArtikel artikel={word.artikel} />
                </td>
                <td>
                  <ColoredPlural pluralForm={word.pluralForm} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
