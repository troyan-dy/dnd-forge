import { useRef } from 'react'
import { useForge } from '@/lib/store'
import { GuideView } from '@/components/GuideView'
import { exportCharacter, parseCharacter } from '@/lib/io'
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
import { spellSlots } from '@/lib/leveling'
import { BACKGROUND_BY_ID } from '@/data/backgrounds'
import { SPELL_BY_ID } from '@/data/spells'
import { FEAT_BY_ID } from '@/data/feats'
import { ABILITIES, ABILITY_LABELS, ABILITY_SHORT } from '@/types'
import { StepHeading } from '@/components/ui/SelectCard'

export function SummaryStep() {
  const character = useForge((s) => s.character)
  const patch = useForge((s) => s.patch)
  const loadCharacter = useForge((s) => s.loadCharacter)
  const reset = useForge((s) => s.reset)
  const setStep = useForge((s) => s.setStep)
  const fileRef = useRef<HTMLInputElement>(null)

  const race = getRace(character)
  const cls = getClass(character)
  const bg = character.backgroundId ? BACKGROUND_BY_ID[character.backgroundId] : null
  const abilities = finalAbilities(character)
  const saves = savingThrows(character)
  const skills = skillRows(character)
  const sc = spellcasting(character)
  const ac = armorClass(character)
  const slots = spellSlots(character)

  const incomplete = !race || !cls || !bg

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const parsed = parseCharacter(String(reader.result))
      if (parsed) loadCharacter(parsed)
      else alert('Не удалось прочитать файл персонажа.')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const level4 = character.level4Choice

  return (
    <div className="space-y-5">
      <StepHeading title="Итог" hint="Готовый лист персонажа и гайд по отыгрышу. Сохраните, распечатайте или начните заново." />

      {/* Action bar */}
      <div className="no-print flex flex-wrap gap-2">
        <button className="btn-primary" onClick={() => exportCharacter(character)}>
          ⬇ Экспорт JSON
        </button>
        <button className="btn-ghost" onClick={() => fileRef.current?.click()}>
          ⬆ Импорт JSON
        </button>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
        <button className="btn-ghost" onClick={() => window.print()}>
          🖨 Печать / как карточка
        </button>
        <button className="btn-ghost" onClick={() => setStep('race')}>
          ✎ Редактировать
        </button>
        <button
          className="btn-danger"
          onClick={() => {
            if (confirm('Создать нового персонажа? Текущий будет удалён.')) reset()
          }}
        >
          ✦ Создать нового
        </button>
      </div>

      {incomplete && (
        <div className="no-print card border-blood-400/40 bg-blood-600/10 text-sm text-parchment-200/80">
          ⚠ Билд не завершён: выберите{' '}
          {[!race && 'расу', !cls && 'класс', !bg && 'предысторию'].filter(Boolean).join(', ')}.
          Вернитесь на нужный шаг через прогресс-бар.
        </div>
      )}

      {/* Name */}
      <div className="no-print card">
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wider text-gold-300/80">Имя персонажа</span>
          <input
            type="text"
            value={character.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="Введите имя героя..."
            className="w-full rounded-lg border border-gold-600/40 bg-ink-800 px-3 py-2 text-parchment-100"
          />
        </label>
      </div>

      {/* Printable character sheet */}
      <div className="card">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-gold-600/20 pb-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-parchment-50">
              {character.name || 'Безымянный герой'}
            </h2>
            <p className="text-sm text-parchment-300/70">
              {[race?.name, cls?.name, cls?.subclass.name, bg?.name].filter(Boolean).join(' · ')}
            </p>
          </div>
          <span className="chip">Уровень {character.level}</span>
        </div>

        {/* Core stats */}
        <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
          <SheetStat label="КД" value={ac.value} note={ac.note} />
          <SheetStat label="Хиты" value={maxHp(character)} />
          <SheetStat label="Инициатива" value={formatModifier(initiative(character))} />
          <SheetStat label="Скорость" value={`${speed(character)} фт`} />
          <SheetStat label="Мастерство" value={formatModifier(proficiencyBonus(character.level))} />
          {sc && <SheetStat label="СЛ закл." value={sc.dc} />}
        </div>

        {/* Abilities */}
        <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {ABILITIES.map((ab) => (
            <div key={ab} className="stat-box" title={ABILITY_LABELS[ab]}>
              <span className="text-[10px] text-gold-300/80">{ABILITY_SHORT[ab]}</span>
              <span className="font-display text-2xl font-bold">{abilities[ab]}</span>
              <span className="text-sm">{formatModifier(abilityModifier(abilities[ab]))}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Saving throws */}
          <div>
            <h3 className="mb-2 text-sm uppercase tracking-wider text-gold-300/80">Спасброски</h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-sm">
              {ABILITIES.map((ab) => (
                <div key={ab} className="flex justify-between">
                  <span className={saves[ab].proficient ? '' : 'text-parchment-300/50'}>
                    {saves[ab].proficient ? '●' : '○'} {ABILITY_LABELS[ab]}
                  </span>
                  <span className="font-mono">{formatModifier(saves[ab].mod)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="mb-2 text-sm uppercase tracking-wider text-gold-300/80">Навыки</h3>
            <div className="grid grid-cols-1 gap-y-0.5 text-sm sm:grid-cols-2">
              {skills.map((s) => (
                <div key={s.skill} className="flex justify-between gap-2">
                  <span className={s.proficient ? '' : 'text-parchment-300/40'}>
                    {s.expertise ? '★' : s.proficient ? '●' : '○'} {s.label}
                  </span>
                  <span className="font-mono">{formatModifier(s.modifier)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Equipment */}
        {cls && (
          <div className="mt-4">
            <h3 className="mb-2 text-sm uppercase tracking-wider text-gold-300/80">Снаряжение</h3>
            <div className="flex flex-wrap gap-1.5">
              {(cls.equipmentPacks.find((p) => p.id === character.equipmentPackId)?.items ?? []).map((it) => (
                <span key={it} className="chip">{it}</span>
              ))}
              {bg?.equipment.map((it) => (
                <span key={it} className="chip opacity-70">{it}</span>
              ))}
            </div>
          </div>
        )}

        {/* Features by level */}
        {cls && (
          <div className="mt-4">
            <h3 className="mb-2 text-sm uppercase tracking-wider text-gold-300/80">
              Особенности (до {character.level} ур.)
            </h3>
            <ul className="space-y-1 text-sm text-parchment-200/85">
              {[...cls.features, ...cls.subclass.features]
                .filter((f) => f.level <= character.level)
                .sort((a, b) => a.level - b.level)
                .map((f, i) => (
                  <li key={`${f.name}-${i}`}>
                    <span className="text-gold-300/70">[{f.level}]</span>{' '}
                    <span className="text-gold-300">{f.name}:</span> {f.description}
                  </li>
                ))}
              {level4.kind === 'feat' && character.level >= 4 && FEAT_BY_ID[level4.featId] && (
                <li>
                  <span className="text-gold-300/70">[4]</span>{' '}
                  <span className="text-gold-300">Черта · {FEAT_BY_ID[level4.featId].name}:</span>{' '}
                  {FEAT_BY_ID[level4.featId].description}
                </li>
              )}
              {level4.kind === 'asi' && character.level >= 4 && (
                <li>
                  <span className="text-gold-300/70">[4]</span>{' '}
                  <span className="text-gold-300">Повышение характеристик:</span>{' '}
                  {ABILITIES.filter((ab) => (level4.abilities[ab] ?? 0) > 0)
                    .map((ab) => `${ABILITY_SHORT[ab]} +${level4.abilities[ab]}`)
                    .join(', ') || '—'}
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Spells */}
        {sc && (
          <div className="mt-4">
            <h3 className="mb-2 text-sm uppercase tracking-wider text-gold-300/80">
              Заклинания {slots.length > 0 && `· ячейки ${slots.join(' / ')}`}
            </h3>
            <SpellList title="Заговоры" ids={character.knownCantrips} />
            <SpellList title="1 круг" ids={character.knownSpells} />
          </div>
        )}
      </div>

      {/* Guide */}
      <div className="card">
        <GuideView character={character} />
      </div>
    </div>
  )
}

function SheetStat({ label, value, note }: { label: string; value: number | string; note?: string }) {
  return (
    <div className="stat-box">
      <span className="text-[10px] text-gold-300/80">{label}</span>
      <span className="font-display text-xl font-bold">{value}</span>
      {note && <span className="text-[8px] text-parchment-300/50">{note}</span>}
    </div>
  )
}

function SpellList({ title, ids }: { title: string; ids: string[] }) {
  if (ids.length === 0) return null
  return (
    <div className="mb-1 text-sm">
      <span className="text-gold-300/70">{title}:</span>{' '}
      {ids.map((id) => SPELL_BY_ID[id]?.name ?? id).join(', ')}
    </div>
  )
}
