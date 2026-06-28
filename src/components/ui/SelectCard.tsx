import type { ReactNode } from 'react'

interface Props {
  selected: boolean
  onClick: () => void
  title: string
  subtitle?: string
  children?: ReactNode
  badges?: string[]
}

/** A selectable card used across picker steps (race / class / background). */
export function SelectCard({ selected, onClick, title, subtitle, children, badges }: Props) {
  return (
    <button
      onClick={onClick}
      className={['card card-hover text-left', selected ? 'card-selected' : ''].join(' ')}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-bold text-parchment-50">{title}</h3>
        {selected && <span className="text-gold-300">✓</span>}
      </div>
      {subtitle && <p className="mt-1 text-sm text-parchment-200/80">{subtitle}</p>}
      {badges && badges.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {badges.map((b) => (
            <span key={b} className="chip">
              {b}
            </span>
          ))}
        </div>
      )}
      {children && <div className="mt-2 text-xs text-parchment-300/70">{children}</div>}
    </button>
  )
}

export function StepHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-4">
      <h2 className="section-title">{title}</h2>
      {hint && <p className="mt-1 text-sm text-parchment-300/70">{hint}</p>}
    </div>
  )
}
