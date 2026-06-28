import { useMemo, useState } from 'react'
import { useForge } from '@/lib/store'
import { SKILLS, skillLabel } from '@/data/skills'
import { CLASS_BY_ID } from '@/data/classes'
import { RACE_BY_ID } from '@/data/races'
import { BACKGROUND_BY_ID } from '@/data/backgrounds'
import { recommend, type ReverseQuery, type Recommendation } from '@/lib/recommend'
import {
  ABILITY_SHORT,
  ROLE_LABELS,
  COMPLEXITY_LABELS,
  type Role,
  type Complexity,
  type SkillId,
} from '@/types'
import { StepHeading } from '@/components/ui/SelectCard'

export function HelpStep() {
  const patch = useForge((s) => s.patch)
  const setStep = useForge((s) => s.setStep)

  const [skills, setSkills] = useState<SkillId[]>([])
  const [role, setRole] = useState<Role | 'any'>('any')
  const [style, setStyle] = useState<ReverseQuery['style']>('any')
  const [complexity, setComplexity] = useState<Complexity | 'any'>('any')
  const [submitted, setSubmitted] = useState(false)

  const query: ReverseQuery = { desiredSkills: skills, role, style, complexity }
  const result = useMemo(() => (submitted ? recommend(query) : null), [submitted, JSON.stringify(query)])

  const toggleSkill = (s: SkillId) =>
    setSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))

  const applyRecommendation = (rec: Recommendation) => {
    const cls = CLASS_BY_ID[rec.classId]
    const race = RACE_BY_ID[rec.raceId]
    // Derive skill picks from the recommendation's covered sources.
    const classPicks: SkillId[] = []
    const racePicks: SkillId[] = []
    for (const src of rec.skillSources) {
      if (!src.covered) continue
      if (src.source.includes('(выбор)')) {
        if (src.source.startsWith('раса')) racePicks.push(src.skill)
        else classPicks.push(src.skill)
      }
    }
    patch({
      raceId: rec.raceId,
      classId: rec.classId,
      subclassId: cls.subclass.id,
      backgroundId: rec.backgroundId,
      classSkillChoices: classPicks.slice(0, cls.skillChoices?.count ?? 0),
      raceSkillChoices: racePicks.slice(0, race.skillChoices?.count ?? 0),
      equipmentPackId: cls.equipmentPacks[0]?.id ?? null,
      knownCantrips: [],
      knownSpells: [],
    })
    setStep('abilities')
  }

  return (
    <div>
      <StepHeading
        title="Помоги выбрать"
        hint="Опишите, чего хотите от персонажа — мы пересечём это с тегами связок класс + раса + предыстория и предложим топ-3. Этот шаг опционален: можно сразу нажать «Далее»."
      />

      {/* Desired skills */}
      <div className="card mb-3">
        <div className="mb-2 text-sm uppercase tracking-wider text-gold-300/80">Желаемые навыки</div>
        <div className="flex flex-wrap gap-1.5">
          {SKILLS.map((s) => (
            <button
              key={s.id}
              onClick={() => toggleSkill(s.id)}
              className={[
                'chip',
                skills.includes(s.id)
                  ? 'border-gold-400 bg-gold-400/20 text-gold-300'
                  : 'hover:border-gold-400/70',
              ].join(' ')}
            >
              {s.label}
              <span className="ml-1 text-[10px] opacity-50">{ABILITY_SHORT[s.ability]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Role / style / complexity */}
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Selector
          label="Роль в группе"
          value={role}
          onChange={(v) => setRole(v as Role | 'any')}
          options={[['any', 'Любая'], ...Object.entries(ROLE_LABELS)]}
        />
        <Selector
          label="Стиль"
          value={style}
          onChange={(v) => setStyle(v as ReverseQuery['style'])}
          options={[
            ['any', 'Любой'],
            ['caster', 'Кастер'],
            ['weapon', 'Оружие'],
            ['mixed', 'Смешанный'],
          ]}
        />
        <Selector
          label="Сложность"
          value={complexity}
          onChange={(v) => setComplexity(v as Complexity | 'any')}
          options={[['any', 'Любая'], ...Object.entries(COMPLEXITY_LABELS)]}
        />
      </div>

      <button className="btn-primary mb-4" onClick={() => setSubmitted(true)}>
        🔮 Подобрать билд
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-3">
          {result.unreachable.length > 0 && (
            <div className="card border-blood-400/40 bg-blood-600/10">
              <div className="mb-1 font-display text-blood-400">⚠ Предупреждение</div>
              <ul className="space-y-1 text-xs text-parchment-200/80">
                {result.unreachable.map((u) => (
                  <li key={u.skill}>
                    <span className="text-parchment-100">{skillLabel(u.skill)}</span>: {u.hint}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.top.map((rec, i) => (
            <RecCard key={`${rec.classId}-${rec.raceId}`} rec={rec} rank={i + 1} onApply={() => applyRecommendation(rec)} />
          ))}
        </div>
      )}
    </div>
  )
}

function RecCard({
  rec,
  rank,
  onApply,
}: {
  rec: Recommendation
  rank: number
  onApply: () => void
}) {
  const cls = CLASS_BY_ID[rec.classId]
  const race = RACE_BY_ID[rec.raceId]
  const bg = BACKGROUND_BY_ID[rec.backgroundId]

  return (
    <div className="card card-hover">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-400 font-display text-xs font-bold text-ink-900">
              {rank}
            </span>
            <h3 className="font-display text-lg font-bold text-parchment-50">
              {cls.name} · {race.name} · {bg.name}
            </h3>
          </div>
          <p className="mt-1 text-xs text-parchment-300/70">
            {cls.subclass.name} · {ROLE_LABELS[cls.role]} · {COMPLEXITY_LABELS[cls.complexity]}
          </p>
        </div>
        <div className="text-right">
          <div className="font-display text-xl font-bold text-gold-300">{rec.score}</div>
          <div className="text-[10px] text-parchment-300/50">очков · {rec.coverage}% навыков</div>
        </div>
      </div>

      {rec.reasons.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {rec.reasons.map((r) => (
            <span key={r} className="chip">
              {r}
            </span>
          ))}
        </div>
      )}

      {rec.skillSources.length > 0 && (
        <div className="mb-3 space-y-0.5 text-xs">
          {rec.skillSources.map((s) => (
            <div key={s.skill} className="flex items-center gap-2">
              <span className={s.covered ? 'text-emerald-300' : 'text-blood-400'}>
                {s.covered ? '✓' : '✗'}
              </span>
              <span className="text-parchment-100">{skillLabel(s.skill)}</span>
              <span className="text-parchment-300/50">— {s.source}</span>
            </div>
          ))}
        </div>
      )}

      <button className="btn-primary w-full" onClick={onApply}>
        Выбрать эту связку →
      </button>
    </div>
  )
}

function Selector({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: [string, string][]
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-gold-300/80">{label}</span>
      <select
        className="w-full rounded-lg border border-gold-600/40 bg-ink-800 px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(([val, lbl]) => (
          <option key={val} value={val}>
            {lbl}
          </option>
        ))}
      </select>
    </label>
  )
}
