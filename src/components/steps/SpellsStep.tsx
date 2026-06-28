import { useForge } from '@/lib/store'
import { getClass, spellcasting } from '@/lib/calculations'
import { spellsForClass } from '@/data/spells'
import type { Spell } from '@/types'
import { StepHeading } from '@/components/ui/SelectCard'

const TAG_LABELS: Record<string, string> = {
  damage: 'Урон',
  control: 'Контроль',
  utility: 'Утилита',
  healing: 'Лечение',
  buff: 'Бафф',
  defense: 'Защита',
}

export function SpellsStep() {
  const character = useForge((s) => s.character)
  const toggleCantrip = useForge((s) => s.toggleCantrip)
  const toggleSpell = useForge((s) => s.toggleSpell)
  const cls = getClass(character)

  if (!cls || !cls.isCaster) {
    return (
      <div>
        <StepHeading title="Заклинания" />
        <p className="text-parchment-300/70">Этот класс не использует заклинания.</p>
      </div>
    )
  }

  const sc = spellcasting(character)
  const maxCantrips = cls.cantripsKnown1 ?? 0
  const maxSpells = cls.spellsKnown1 ?? 0
  const cantrips = spellsForClass(cls.id, 0)
  const level1 = spellsForClass(cls.id, 1)

  return (
    <div>
      <StepHeading
        title="Заклинания"
        hint={`Выберите заговоры и заклинания 1 круга для класса ${cls.name}.`}
      />

      {sc && (
        <div className="mb-4 flex gap-2">
          <span className="chip">СЛ заклинания {sc.dc}</span>
          <span className="chip">Бонус атаки {sc.attack >= 0 ? `+${sc.attack}` : sc.attack}</span>
        </div>
      )}

      <SpellGroup
        title="Заговоры (0 круг)"
        spells={cantrips}
        selected={character.knownCantrips}
        max={maxCantrips}
        onToggle={(id) => toggleCantrip(id, maxCantrips)}
      />
      <SpellGroup
        title="Заклинания 1 круга"
        spells={level1}
        selected={character.knownSpells}
        max={maxSpells}
        onToggle={(id) => toggleSpell(id, maxSpells)}
      />
    </div>
  )
}

function SpellGroup({
  title,
  spells,
  selected,
  max,
  onToggle,
}: {
  title: string
  spells: Spell[]
  selected: string[]
  max: number
  onToggle: (id: string) => void
}) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm uppercase tracking-wider text-gold-300/80">{title}</div>
        <span className="chip">
          {selected.length}/{max}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {spells.map((sp) => {
          const isSel = selected.includes(sp.id)
          const atMax = selected.length >= max && !isSel
          return (
            <button
              key={sp.id}
              onClick={() => onToggle(sp.id)}
              disabled={atMax}
              className={[
                'card card-hover text-left',
                isSel ? 'card-selected' : '',
                atMax ? 'opacity-40' : '',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-display font-bold text-parchment-50">
                  {isSel ? '✓ ' : ''}
                  {sp.name}
                </h4>
                <span className="text-[10px] text-parchment-300/50">{sp.school}</span>
              </div>
              <p className="mt-1 text-xs text-parchment-200/80">{sp.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {sp.concentration && <span className="chip text-blood-400">Концентрация</span>}
                {sp.spellTags.map((t) => (
                  <span key={t} className="chip">
                    {TAG_LABELS[t] ?? t}
                  </span>
                ))}
                <span className="chip opacity-60">{sp.range}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
