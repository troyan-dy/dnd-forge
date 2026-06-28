import { useEffect, useMemo, useState } from 'react'
import { useForge } from '@/lib/store'
import type { Ability, AbilityMode } from '@/types'
import { ABILITIES, ABILITY_LABELS, ABILITY_SHORT } from '@/types'
import { abilityModifier, formatModifier, finalAbilities, getRace } from '@/lib/calculations'
import { StepHeading } from '@/components/ui/SelectCard'

const POINT_COST: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }
const POINT_BUDGET = 27
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8]

// 4d6 drop lowest. Uses a seedless RNG — fine for character rolls.
function roll4d6(): number {
  const dice = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
  dice.sort((a, b) => a - b)
  return dice[1] + dice[2] + dice[3]
}

export function AbilitiesStep() {
  const character = useForge((s) => s.character)
  const setMode = useForge((s) => s.setAbilityMode)
  const setBaseAbility = useForge((s) => s.setBaseAbility)
  const setBaseAbilities = useForge((s) => s.setBaseAbilities)
  const setRaceFlex = useForge((s) => s.setRaceFlex)
  const race = getRace(character)

  const final = finalAbilities(character)

  return (
    <div>
      <StepHeading
        title="Характеристики"
        hint="Выберите способ набора. Итоги ниже уже учитывают расовые бонусы и модификаторы."
      />

      {/* Mode switch */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ['pointbuy', 'Покупка очков (27)'],
            ['standard', 'Стандартный набор'],
            ['roll', '4d6 (бросок)'],
          ] as [AbilityMode, string][]
        ).map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => {
              setMode(mode)
              if (mode === 'pointbuy') {
                setBaseAbilities({ str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 })
              } else if (mode === 'standard') {
                setBaseAbilities({ str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 })
              }
            }}
            className={[
              'btn',
              character.abilityMode === mode ? 'btn-primary' : 'btn-ghost',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {character.abilityMode === 'pointbuy' && (
        <PointBuy abilities={character.baseAbilities} setAbility={setBaseAbility} />
      )}
      {character.abilityMode === 'standard' && (
        <Assignment
          pool={STANDARD_ARRAY}
          abilities={character.baseAbilities}
          onAssign={setBaseAbilities}
        />
      )}
      {character.abilityMode === 'roll' && (
        <RollMode abilities={character.baseAbilities} onAssign={setBaseAbilities} />
      )}

      {/* Half-elf flexible bonus */}
      {race?.flexibleAbilityBonus && (
        <FlexBonus
          count={race.flexibleAbilityBonus.count}
          exclude={race.flexibleAbilityBonus.exclude ?? []}
          chosen={character.raceFlexBonus}
          onChange={setRaceFlex}
        />
      )}

      {/* Final totals */}
      <div className="mt-6">
        <div className="mb-2 text-sm uppercase tracking-wider text-gold-300/80">
          Итог с расовыми бонусами
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {ABILITIES.map((ab) => {
            const raceBonus =
              (race?.abilityBonuses[ab] ?? 0) + (character.raceFlexBonus[ab] ?? 0)
            return (
              <div key={ab} className="stat-box">
                <span className="text-[10px] text-gold-300/80">{ABILITY_SHORT[ab]}</span>
                <span className="font-display text-xl font-bold text-parchment-50">{final[ab]}</span>
                <span className="text-xs text-parchment-200">
                  {formatModifier(abilityModifier(final[ab]))}
                </span>
                {raceBonus > 0 && (
                  <span className="text-[9px] text-gold-400">+{raceBonus} раса</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function PointBuy({
  abilities,
  setAbility,
}: {
  abilities: Record<Ability, number>
  setAbility: (a: Ability, v: number) => void
}) {
  const spent = ABILITIES.reduce((sum, ab) => sum + (POINT_COST[abilities[ab]] ?? 0), 0)
  const remaining = POINT_BUDGET - spent

  const canInc = (ab: Ability) => {
    const v = abilities[ab]
    if (v >= 15) return false
    const cost = (POINT_COST[v + 1] ?? 99) - (POINT_COST[v] ?? 0)
    return remaining >= cost
  }
  const canDec = (ab: Ability) => abilities[ab] > 8

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="chip">Осталось очков: {remaining}</span>
        <span className="text-xs text-parchment-300/60">Диапазон 8–15, потолок 27 очков</span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {ABILITIES.map((ab) => (
          <div
            key={ab}
            className="flex items-center justify-between rounded-lg border border-gold-600/30 bg-ink-700/70 px-3 py-2"
          >
            <span className="font-display text-sm">{ABILITY_LABELS[ab]}</span>
            <div className="flex items-center gap-3">
              <button
                className="h-7 w-7 rounded-md border border-gold-600/40 text-gold-300 disabled:opacity-30"
                onClick={() => setAbility(ab, abilities[ab] - 1)}
                disabled={!canDec(ab)}
              >
                −
              </button>
              <span className="w-6 text-center font-display text-lg font-bold">{abilities[ab]}</span>
              <button
                className="h-7 w-7 rounded-md border border-gold-600/40 text-gold-300 disabled:opacity-30"
                onClick={() => setAbility(ab, abilities[ab] + 1)}
                disabled={!canInc(ab)}
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

/** Assign a fixed pool of values (standard array) to the six abilities. */
function Assignment({
  pool,
  abilities,
  onAssign,
}: {
  pool: number[]
  abilities: Record<Ability, number>
  onAssign: (vals: Record<Ability, number>) => void
}) {
  // Track assignment by pool index so duplicate values stay distinct.
  const [assign, setAssign] = useState<Record<Ability, number | null>>(() =>
    reconstruct(pool, abilities),
  )

  // Reset when the pool changes (e.g. switching from a previous roll).
  useEffect(() => {
    setAssign(reconstruct(pool, abilities))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.join(',')])

  const usedIdx = new Set(Object.values(assign).filter((v): v is number => v !== null))

  const pick = (ab: Ability, idx: number | null) => {
    const nextAssign = { ...assign, [ab]: idx }
    setAssign(nextAssign)
    const vals = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 } as Record<Ability, number>
    for (const a of ABILITIES) {
      const i = nextAssign[a]
      vals[a] = i !== null && i !== undefined ? pool[i] : 8
    }
    onAssign(vals)
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <span className="text-xs text-parchment-300/60">Доступные значения:</span>
        {pool.map((v, i) => (
          <span key={i} className={['chip', usedIdx.has(i) ? 'opacity-30' : ''].join(' ')}>
            {v}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {ABILITIES.map((ab) => (
          <div
            key={ab}
            className="flex items-center justify-between rounded-lg border border-gold-600/30 bg-ink-700/70 px-3 py-2"
          >
            <span className="font-display text-sm">{ABILITY_LABELS[ab]}</span>
            <select
              className="rounded-md border border-gold-600/40 bg-ink-800 px-2 py-1 text-sm"
              value={assign[ab] ?? ''}
              onChange={(e) => pick(ab, e.target.value === '' ? null : Number(e.target.value))}
            >
              <option value="">—</option>
              {pool.map((v, i) => (
                <option key={i} value={i} disabled={usedIdx.has(i) && assign[ab] !== i}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

function RollMode({
  abilities,
  onAssign,
}: {
  abilities: Record<Ability, number>
  onAssign: (vals: Record<Ability, number>) => void
}) {
  const [pool, setPool] = useState<number[] | null>(null)

  const doRoll = () => {
    const rolled = Array.from({ length: 6 }, roll4d6).sort((a, b) => b - a)
    setPool(rolled)
    onAssign({ str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 })
  }

  const total = useMemo(() => (pool ? pool.reduce((a, b) => a + b, 0) : 0), [pool])

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button className="btn-primary" onClick={doRoll}>
          🎲 {pool ? 'Перебросить' : 'Бросить 4d6'}
        </button>
        {pool && <span className="chip">Сумма: {total}</span>}
        <span className="text-xs text-parchment-300/60">4d6, отбрасываем младший кубик</span>
      </div>
      {!pool ? (
        <p className="text-sm text-parchment-300/60">
          Нажмите «Бросить 4d6», чтобы сгенерировать шесть значений, затем распределите их.
        </p>
      ) : (
        <Assignment pool={pool} abilities={abilities} onAssign={onAssign} />
      )}
    </div>
  )
}

function FlexBonus({
  count,
  exclude,
  chosen,
  onChange,
}: {
  count: number
  exclude: Ability[]
  chosen: Partial<Record<Ability, number>>
  onChange: (b: Partial<Record<Ability, number>>) => void
}) {
  const chosenAbilities = ABILITIES.filter((ab) => (chosen[ab] ?? 0) > 0)
  const toggle = (ab: Ability) => {
    const isOn = (chosen[ab] ?? 0) > 0
    const next = { ...chosen }
    if (isOn) delete next[ab]
    else if (chosenAbilities.length < count) next[ab] = 1
    else return
    onChange(next)
  }

  return (
    <div className="mt-5 rounded-lg border border-gold-600/30 bg-ink-700/60 p-3">
      <div className="mb-2 text-sm text-gold-300">
        Гибкий расовый бонус: выберите {count} характеристики для +1 (кроме{' '}
        {exclude.map((e) => ABILITY_SHORT[e]).join(', ')})
      </div>
      <div className="flex flex-wrap gap-2">
        {ABILITIES.filter((ab) => !exclude.includes(ab)).map((ab) => {
          const on = (chosen[ab] ?? 0) > 0
          return (
            <button
              key={ab}
              onClick={() => toggle(ab)}
              className={['chip', on ? 'border-gold-400 bg-gold-400/20 text-gold-300' : ''].join(' ')}
            >
              {ABILITY_LABELS[ab]} {on ? '+1' : ''}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Try to map current ability values back onto pool indices (best-effort).
function reconstruct(pool: number[], abilities: Record<Ability, number>): Record<Ability, number | null> {
  const result = {} as Record<Ability, number | null>
  const used = new Set<number>()
  for (const ab of ABILITIES) {
    const idx = pool.findIndex((v, i) => v === abilities[ab] && !used.has(i))
    if (idx >= 0) {
      result[ab] = idx
      used.add(idx)
    } else {
      result[ab] = null
    }
  }
  return result
}
