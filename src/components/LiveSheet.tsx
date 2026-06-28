import { useForge } from '@/lib/store'
import { ABILITIES, ABILITY_SHORT, ABILITY_LABELS } from '@/types'
import {
  finalAbilities,
  abilityModifier,
  formatModifier,
  proficiencyBonus,
  maxHp,
  armorClass,
  initiative,
  speed,
  savingThrows,
  skillRows,
  spellcasting,
  getRace,
  getClass,
} from '@/lib/calculations'
import { BACKGROUND_BY_ID } from '@/data/backgrounds'

export function LiveSheet() {
  const character = useForge((s) => s.character)
  const abilities = finalAbilities(character)
  const race = getRace(character)
  const cls = getClass(character)
  const bg = character.backgroundId ? BACKGROUND_BY_ID[character.backgroundId] : null
  const saves = savingThrows(character)
  const skills = skillRows(character)
  const sc = spellcasting(character)
  const ac = armorClass(character)
  const profSkills = skills.filter((s) => s.proficient)

  return (
    <div className="card border-gold-600/40 bg-ink-700/90">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="section-title text-lg">Лист персонажа</h2>
        <span className="chip">Ур. {character.level}</span>
      </div>

      <div className="mb-3">
        <div className="font-display text-lg font-bold text-parchment-50">
          {character.name || 'Безымянный герой'}
        </div>
        <div className="text-xs text-parchment-300/70">
          {[race?.name, cls?.name, cls?.subclass.name].filter(Boolean).join(' · ') || 'Раса и класс не выбраны'}
          {bg ? ` · ${bg.name}` : ''}
        </div>
      </div>

      {/* Top stats */}
      <div className="mb-3 grid grid-cols-5 gap-1.5 text-center">
        <Stat label="КД" value={ac.value} />
        <Stat label="ОЗ" value={maxHp(character)} />
        <Stat label="Иниц." value={formatModifier(initiative(character))} />
        <Stat label="Скор." value={speed(character)} />
        <Stat label="Маст." value={formatModifier(proficiencyBonus(character.level))} />
      </div>
      <p className="mb-3 text-[10px] text-parchment-300/50">КД: {ac.note}</p>

      {/* Abilities */}
      <div className="mb-3 grid grid-cols-3 gap-1.5">
        {ABILITIES.map((ab) => {
          const mod = abilityModifier(abilities[ab])
          return (
            <div key={ab} className="stat-box" title={ABILITY_LABELS[ab]}>
              <span className="text-[10px] text-gold-300/80">{ABILITY_SHORT[ab]}</span>
              <span className="font-display text-lg font-bold text-parchment-50">{abilities[ab]}</span>
              <span className="text-xs text-parchment-200">{formatModifier(mod)}</span>
            </div>
          )
        })}
      </div>

      {/* Spellcasting */}
      {sc && (
        <div className="mb-3 flex gap-2 text-xs">
          <span className="chip">СЛ заклинаний {sc.dc}</span>
          <span className="chip">Атака {formatModifier(sc.attack)}</span>
        </div>
      )}

      {/* Saving throws */}
      <div className="mb-3">
        <div className="mb-1 text-[11px] uppercase tracking-wider text-gold-300/70">Спасброски</div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs">
          {ABILITIES.map((ab) => (
            <div key={ab} className="flex items-center justify-between">
              <span className={saves[ab].proficient ? 'text-parchment-100' : 'text-parchment-300/60'}>
                {saves[ab].proficient ? '●' : '○'} {ABILITY_SHORT[ab]}
              </span>
              <span className="font-mono">{formatModifier(saves[ab].mod)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Proficient skills */}
      <div>
        <div className="mb-1 text-[11px] uppercase tracking-wider text-gold-300/70">
          Навыки с владением ({profSkills.length})
        </div>
        {profSkills.length === 0 ? (
          <p className="text-xs text-parchment-300/50">Пока не выбраны</p>
        ) : (
          <div className="grid grid-cols-1 gap-y-0.5 text-xs">
            {profSkills.map((s) => (
              <div key={s.skill} className="flex items-center justify-between">
                <span className="text-parchment-100">
                  {s.expertise ? '★' : '●'} {s.label}
                  <span className="ml-1 text-[10px] text-parchment-300/40">{ABILITY_SHORT[s.ability]}</span>
                </span>
                <span className="font-mono text-gold-300">{formatModifier(s.modifier)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="stat-box">
      <span className="text-[10px] text-gold-300/80">{label}</span>
      <span className="font-display text-base font-bold text-parchment-50">{value}</span>
    </div>
  )
}
