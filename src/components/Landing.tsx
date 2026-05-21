type LandingProps = {
  onStudy: () => void
  onPractice: () => void
}

export function Landing({ onStudy, onPractice }: LandingProps) {
  return (
    <div className="app">
      <header className="header">
        <h1>Artikel Trainer</h1>
        <p className="subtitle">Practice German articles — der, die, das</p>
      </header>

      <div className="mode-buttons">
        <button type="button" className="mode-btn mode-btn--study" onClick={onStudy}>
          Study
        </button>
        <button type="button" className="mode-btn mode-btn--practice" onClick={onPractice}>
          Practice
        </button>
      </div>
    </div>
  )
}
