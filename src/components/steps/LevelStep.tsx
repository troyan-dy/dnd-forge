import { useState } from 'react'
import { useForge } from '@/lib/store'
import { getClass } from '@/lib/calculations'
import { levelTrack } from '@/lib/leveling'
import { FEATS } from '@/data/feats'
import { ABILITIES, ABILITY_LABELS, ABILITY_SHORT, type Ability, type Level4Choice } from '@/types'
import { StepHeading } from '@/components/ui/SelectCard'

export function LevelStep() {
  const character = useForge((s) => s.character)
  const setLevel = useForge((s) => s.setLevel)
  const setLevel4Choice = useForge((s) => s.setLevel4Choice)
  const cls = getClass(character)
  const [openLevel, setOpenLevel] = useState<number>(character.level)

  if (!cls) {
    return (
      <div>
        <StepHeading title="Прокачка 1→5" />
        <p className="text-parchment-300/70">Сначала выберите класс.</p>
      </div>
    )
  }

  const track = levelTrack(cls.id)

  return (
    <div>
      <StepHeading
        title="Прокачка 1→5"
        hint="Кликните по уровню, чтобы увидеть детали. Установите целевой уровень билда — лист пересчитается."
      />

      {/* Target level selector */}
      <div className="card mb-4">
        <div className="mb-2 text-sm uppercase tracking-wider text-gold-300/80">Целевой уровень</div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={['btn', character.level === lvl ? 'btn-primary' : 'btn-ghost'].join(' ')}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Level track */}
      <div className="space-y-2">
        {track.map((row) => {
          const isOpen = openLevel === row.level
          const reached = character.level >= row.level
          return (
            <div
              key={row.level}
              className={[
                'card',
                reached ? 'border-gold-400/50' : 'opacity-60',
                isOpen ? 'card-selected' : 'card-hover',
              ].join(' ')}
            >
              <button
                className="flex w-full items-center justify-between text-left"
                onClick={() => setOpenLevel(isOpen ? -1 : row.level)}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={[
                      'flex h-9 w-9 items-center justify-center rounded-full font-display font-bold',
                      reached ? 'bg-gold-400 text-ink-900' : 'bg-ink-600 text-parchment-300/60',
                    ].join(' ')}
                  >
                    {row.level}
                  </span>
                  <div>
                    <div className="font-display font-bold text-parchment-50">
                      Уровень {row.level}
                      {row.isSubclass && <span className="ml-2 text-xs text-gold-300">★ подкласс</span>}
                      {row.isASI && <span className="ml-2 text-xs text-blood-400">ASI / черта</span>}
                    </div>
                    <div className="text-xs text-parchment-300/60">
                      Мастерство +{row.proficiency}
                      {row.slots.length > 0 && ` · ячейки: ${row.slots.join(' / ')}`}
                    </div>
                  </div>
                </div>
                <span className="text-gold-300">{isOpen ? '−' : '+'}</span>
              </button>

              {isOpen && (
                <div className="mt-3 space-y-2 border-t border-gold-600/20 pt-3">
                  {row.features.length === 0 ? (
                    <p className="text-xs text-parchment-300/50">Нет новых классовых особенностей.</p>
                  ) : (
                    row.features.map((f) => (
                      <div key={f.name} className="text-sm">
                        <span className="text-gold-300">{f.name}:</span>{' '}
                        <span className="text-parchment-200/80">{f.description}</span>
                      </div>
                    ))
                  )}

                  {/* ASI / Feat picker at level 4 */}
                  {row.isASI && (
                    <ASIFeatPicker
                      choice={character.level4Choice}
                      onChange={setLevel4Choice}
                      locked={character.level < 4}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ASIFeatPicker({
  choice,
  onChange,
  locked,
}: {
  choice: Level4Choice
  onChange: (c: Level4Choice) => void
  locked: boolean
}) {
  return (
    <div className="mt-2 rounded-lg border border-blood-400/30 bg-ink-800/60 p-3">
      <div className="mb-2 text-sm text-blood-400">Выбор на 4 уровне</div>
      {locked && (
        <p className="mb-2 text-xs text-parchment-300/50">
          Доступно с 4 уровня. Поднимите целевой уровень до 4+, чтобы применить.
        </p>
      )}
      <div className="mb-3 flex gap-2">
        <button
          className={['btn text-xs', choice.kind === 'asi' ? 'btn-primary' : 'btn-ghost'].join(' ')}
          onClick={() => onChange({ kind: 'asi', abilities: {} })}
        >
          Повышение характеристик
        </button>
        <button
          className={['btn text-xs', choice.kind === 'feat' ? 'btn-primary' : 'btn-ghost'].join(' ')}
          onClick={() => onChange({ kind: 'feat', featId: FEATS[0].id })}
        >
          Черта
        </button>
        <button
          className={['btn text-xs', choice.kind === 'none' ? 'btn-primary' : 'btn-ghost'].join(' ')}
          onClick={() => onChange({ kind: 'none' })}
        >
          Не выбрано
        </button>
      </div>

      {choice.kind === 'asi' && <ASIEditor choice={choice} onChange={onChange} />}
      {choice.kind === 'feat' && (
        <div className="space-y-2">
          {FEATS.map((f) => (
            <button
              key={f.id}
              onClick={() => onChange({ kind: 'feat', featId: f.id })}
              className={[
                'card card-hover w-full text-left',
                choice.featId === f.id ? 'card-selected' : '',
              ].join(' ')}
            >
              <div className="font-display font-bold text-parchment-50">
                {choice.featId === f.id ? '✓ ' : ''}
                {f.name}
              </div>
              <p className="mt-1 text-xs text-parchment-200/80">{f.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ASIEditor({
  choice,
  onChange,
}: {
  choice: Extract<Level4Choice, { kind: 'asi' }>
  onChange: (c: Level4Choice) => void
}) {
  const total = ABILITIES.reduce((sum, ab) => sum + (choice.abilities[ab] ?? 0), 0)
  const remaining = 2 - total

  const bump = (ab: Ability, delta: number) => {
    const cur = choice.abilities[ab] ?? 0
    const next = cur + delta
    if (next < 0 || next > 2) return
    if (delta > 0 && remaining <= 0) return
    const abilities = { ...choice.abilities, [ab]: next }
    if (next === 0) delete abilities[ab]
    onChange({ kind: 'asi', abilities })
  }

  return (
    <div>
      <p className="mb-2 text-xs text-parchment-300/60">
        Распределите +2 (например, +2 в одну или +1 в две). Осталось: {remaining}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ABILITIES.map((ab) => (
          <div
            key={ab}
            className="flex items-center justify-between rounded-md border border-gold-600/30 bg-ink-700/70 px-2 py-1.5"
          >
            <span className="text-xs">{ABILITY_SHORT[ab]}</span>
            <div className="flex items-center gap-2">
              <button
                className="h-6 w-6 rounded border border-gold-600/40 text-gold-300 disabled:opacity-30"
                onClick={() => bump(ab, -1)}
                disabled={(choice.abilities[ab] ?? 0) <= 0}
                title={`Убавить ${ABILITY_LABELS[ab]}`}
              >
                −
              </button>
              <span className="w-4 text-center">+{choice.abilities[ab] ?? 0}</span>
              <button
                className="h-6 w-6 rounded border border-gold-600/40 text-gold-300 disabled:opacity-30"
                onClick={() => bump(ab, 1)}
                disabled={remaining <= 0 || (choice.abilities[ab] ?? 0) >= 2}
                title={`Добавить ${ABILITY_LABELS[ab]}`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
