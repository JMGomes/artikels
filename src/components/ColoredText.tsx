import type { Artikel } from '../types'

export function ColoredArtikel({ artikel }: { artikel: Artikel }) {
  return <span className={`artikel-text artikel-text--${artikel}`}>{artikel}</span>
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
