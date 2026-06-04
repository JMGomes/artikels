import { isLightSwatch } from '../../utils/colors'

type ColorSwatchProps = {
  hex: string
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export function ColorSwatch({ hex, size = 'md', label }: ColorSwatchProps) {
  const light = isLightSwatch(hex)

  return (
    <span
      className={`color-swatch color-swatch--${size}${light ? ' color-swatch--light' : ''}`}
      style={{ backgroundColor: hex }}
      role={label ? 'img' : undefined}
      aria-label={label}
      title={label}
    />
  )
}
