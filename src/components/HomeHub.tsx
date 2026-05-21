type HomeHubProps = {
  onArtikel: () => void
  onSentences: () => void
}

export function HomeHub({ onArtikel, onSentences }: HomeHubProps) {
  return (
    <div className="app">
      <header className="header">
        <h1>German Trainer</h1>
        <p className="subtitle">Choose an exercise</p>
      </header>

      <div className="hub-buttons">
        <button type="button" className="hub-btn hub-btn--artikel" onClick={onArtikel}>
          <span className="hub-btn__title">Artikel</span>
          <span className="hub-btn__desc">der, die, das</span>
        </button>
        <button type="button" className="hub-btn hub-btn--sentences" onClick={onSentences}>
          <span className="hub-btn__title">Sentences</span>
          <span className="hub-btn__desc">Word order &amp; questions</span>
        </button>
      </div>
    </div>
  )
}
