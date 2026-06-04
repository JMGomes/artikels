type HomeHubProps = {
  onArtikel: () => void
  onSentences: () => void
  onWordOrder: () => void
  onConjugation: () => void
  onColors: () => void
  onTime: () => void
}

export function HomeHub({
  onArtikel,
  onSentences,
  onWordOrder,
  onConjugation,
  onColors,
  onTime,
}: HomeHubProps) {
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
        <button type="button" className="hub-btn hub-btn--conjugation" onClick={onConjugation}>
          <span className="hub-btn__title">Verbs</span>
          <span className="hub-btn__desc">Present tense · conjugation</span>
        </button>
        <button type="button" className="hub-btn hub-btn--colors" onClick={onColors}>
          <span className="hub-btn__title">Colors</span>
          <span className="hub-btn__desc">Match English &amp; German</span>
        </button>
        <button type="button" className="hub-btn hub-btn--time" onClick={onTime}>
          <span className="hub-btn__title">Clock</span>
          <span className="hub-btn__desc">Digital ↔ German time</span>
        </button>
      </div>
    </div>
  )
}
