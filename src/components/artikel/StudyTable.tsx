import type { Word } from '../../types'
import { ColoredArtikel, GermanWordWithPlural } from './ColoredText'

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
      </div>

      <div className="table-wrap">
        <table className="study-table">
          <thead>
            <tr>
              <th>Artikel</th>
              <th>German</th>
              <th>English</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((word) => (
              <tr key={word.germanWord}>
                <td>
                  <ColoredArtikel artikel={word.artikel} />
                </td>
                <td>
                  <GermanWordWithPlural word={word} />
                </td>
                <td>{word.englishTranslation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
