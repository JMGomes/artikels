import type { ColorEntry } from '../../types/color'
import { ColorSwatch } from './ColorSwatch'

type ColorStudyProps = {
  colors: ColorEntry[]
  onBack: () => void
}

export function ColorStudy({ colors, onBack }: ColorStudyProps) {
  const sorted = [...colors].sort((a, b) => a.english.localeCompare(b.english))

  return (
    <div className="app app--wide">
      <header className="header header--row">
        <div>
          <h1>Study</h1>
          <p className="subtitle">{colors.length} colors</p>
        </div>
        <button type="button" className="back-btn" onClick={onBack}>
          ← Menu
        </button>
      </header>

      <div className="table-wrap">
        <table className="study-table color-study-table">
          <thead>
            <tr>
              <th>Color</th>
              <th>English</th>
              <th>German</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((color) => (
              <tr key={color.id}>
                <td>
                  <ColorSwatch hex={color.hex} size="lg" label={color.english} />
                </td>
                <td>{color.english}</td>
                <td>{color.german}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
