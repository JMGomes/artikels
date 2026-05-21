import type { Artikel, Word } from '../../types'

export function ColoredArtikel({ artikel }: { artikel: Artikel }) {
  return <span className={`artikel-text artikel-text--${artikel}`}>{artikel}</span>
}

/** Plural label without leading "die ", e.g. "die Abende" → "Abende". */
export function pluralNounOnly(pluralForm: string): string {
  return pluralForm.startsWith('die ') ? pluralForm.slice(4) : pluralForm
}

export function GermanWordWithPlural({ word }: { word: Word }) {
  const plural = pluralNounOnly(word.pluralForm)
  return (
    <span className="german-with-plural">
      <span className="german-with-plural__word">{word.germanWord}</span>
      <span className="german-with-plural__plural"> ({plural})</span>
    </span>
  )
}

export function ColoredPlural({ pluralForm }: { pluralForm: string }) {
  if (pluralForm.startsWith('die ')) {
    return (
      <>
        <span className="plural-die">die</span> {pluralForm.slice(4)}
      </>
    )
  }

  return <span className="plural-plain">{pluralForm}</span>
}
