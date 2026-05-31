type HomeHubProps = {
  onArtikel: () => void
  onSentences: () => void
  onWordOrder: () => void
}

export function HomeHub({ onArtikel, onSentences, onWordOrder }: HomeHubProps) {
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
          <span className="hub-btn__desc">Questions &amp; answers</span>
        </button>
        <button type="button" className="hub-btn hub-btn--wordorder" onClick={onWordOrder}>
          <span className="hub-btn__title">Word order</span>
          <span className="hub-btn__desc">Daily routine · ich/du/wir</span>
        </button>
      </div>
    </div>
  )
}
