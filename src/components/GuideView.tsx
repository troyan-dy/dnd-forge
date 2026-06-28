import type { CharacterState } from '@/types'
import { buildGuide, type GuideCard } from '@/lib/guide'

const ICONS: Record<string, string> = {
  'В бою': '⚔️',
  'Вне боя': '🗺️',
  'Прокачка наперёд': '📈',
  Комбо: '✨',
}

export function GuideView({ character }: { character: CharacterState }) {
  const guide = buildGuide(character)
  if (!guide) {
    return <p className="text-parchment-300/60">Выберите класс, чтобы получить гайд по отыгрышу.</p>
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="section-title">Гайд по отыгрышу</h2>
        <p className="mt-1 text-sm text-parchment-300/70">
          Собран по правилам из тегов вашего билда: <span className="text-gold-300">{guide.archetype}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card card={guide.combat} />
        <Card card={guide.outOfCombat} />
        <Card card={guide.leveling} />
        <Card card={guide.combos} />
      </div>
    </div>
  )
}

function Card({ card }: { card: GuideCard }) {
  return (
    <div className="card">
      <h3 className="mb-2 font-display text-lg font-bold text-gold-300">
        <span className="mr-1">{ICONS[card.title] ?? '•'}</span>
        {card.title}
      </h3>
      <ul className="space-y-2 text-sm text-parchment-200/90">
        {card.blocks.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1 text-gold-400/60">▸</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
