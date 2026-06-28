import { useForge } from '@/lib/store'
import { SKILLS, skillLabel } from '@/data/skills'
import { ABILITY_SHORT, type SkillId } from '@/types'
import { getClass, getRace } from '@/lib/calculations'
import { BACKGROUND_BY_ID } from '@/data/backgrounds'
import { StepHeading } from '@/components/ui/SelectCard'

export function SkillsStep() {
  const character = useForge((s) => s.character)
  const toggleClassSkill = useForge((s) => s.toggleClassSkill)
  const toggleRaceSkill = useForge((s) => s.toggleRaceSkill)
  const cls = getClass(character)
  const race = getRace(character)
  const bg = character.backgroundId ? BACKGROUND_BY_ID[character.backgroundId] : null

  if (!cls) {
    return (
      <div>
        <StepHeading title="Навыки и владения" />
        <p className="text-parchment-300/70">Сначала выберите класс.</p>
      </div>
    )
  }

  // Skills already granted automatically (cannot pick the same one twice).
  const granted = new Set<SkillId>()
  cls.grantsSkills?.forEach((s) => granted.add(s))
  race?.grantsSkills?.forEach((s) => granted.add(s))
  bg?.grantsSkills.forEach((s) => granted.add(s))

  const classChoice = cls.skillChoices
  const raceChoice = race?.skillChoices

  return (
    <div>
      <StepHeading
        title="Навыки и владения"
        hint="Зелёным отмечены навыки, которые уже даны автоматически. Выберите остальные из пулов класса и расы."
      />

      {/* Auto-granted */}
      {granted.size > 0 && (
        <div className="card mb-4">
          <div className="mb-2 text-sm uppercase tracking-wider text-gold-300/80">
            Получены автоматически
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[...granted].map((s) => (
              <span key={s} className="chip border-emerald-500/40 text-emerald-300">
                ✓ {skillLabel(s)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Class skill choices */}
      {classChoice && (
        <SkillPicker
          title={`Навыки класса ${cls.name}`}
          hint={`Выберите ${classChoice.count}`}
          pool={classChoice.pool}
          selected={character.classSkillChoices}
          max={classChoice.count}
          granted={granted}
          onToggle={(s) => toggleClassSkill(s, classChoice.count)}
          expertiseNote={cls.id === 'rogue' ? 'Первые два навыка получат экспертизу (×2 мастерство).' : undefined}
        />
      )}

      {/* Race skill choices (half-elf) */}
      {raceChoice && (
        <SkillPicker
          title={`Навыки расы ${race?.name}`}
          hint={`Выберите ${raceChoice.count}`}
          pool={raceChoice.pool}
          selected={character.raceSkillChoices}
          max={raceChoice.count}
          granted={granted}
          onToggle={(s) => toggleRaceSkill(s, raceChoice.count)}
        />
      )}
    </div>
  )
}

function SkillPicker({
  title,
  hint,
  pool,
  selected,
  max,
  granted,
  onToggle,
  expertiseNote,
}: {
  title: string
  hint: string
  pool: SkillId[]
  selected: SkillId[]
  max: number
  granted: Set<SkillId>
  onToggle: (s: SkillId) => void
  expertiseNote?: string
}) {
  const poolDefs = SKILLS.filter((s) => pool.includes(s.id))
  return (
    <div className="card mb-4">
      <div className="mb-1 flex items-center justify-between">
        <div className="text-sm uppercase tracking-wider text-gold-300/80">{title}</div>
        <span className="chip">
          {selected.length}/{max}
        </span>
      </div>
      <p className="mb-2 text-xs text-parchment-300/60">{hint}</p>
      {expertiseNote && <p className="mb-2 text-xs text-gold-300/70">★ {expertiseNote}</p>}
      <div className="flex flex-wrap gap-1.5">
        {poolDefs.map((s) => {
          const isGranted = granted.has(s.id)
          const isSel = selected.includes(s.id)
          const atMax = selected.length >= max && !isSel
          return (
            <button
              key={s.id}
              disabled={isGranted || atMax}
              onClick={() => onToggle(s.id)}
              className={[
                'chip transition-colors',
                isGranted
                  ? 'border-emerald-500/30 text-emerald-300/50 line-through'
                  : isSel
                    ? 'border-gold-400 bg-gold-400/20 text-gold-300'
                    : atMax
                      ? 'opacity-40'
                      : 'hover:border-gold-400/70',
              ].join(' ')}
            >
              {isSel ? '✓ ' : ''}
              {s.label}
              <span className="ml-1 text-[10px] opacity-50">{ABILITY_SHORT[s.ability]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
