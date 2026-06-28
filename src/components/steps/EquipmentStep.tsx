import { useForge } from '@/lib/store'
import { getClass, getRace } from '@/lib/calculations'
import { BACKGROUND_BY_ID } from '@/data/backgrounds'
import { SelectCard, StepHeading } from '@/components/ui/SelectCard'

export function EquipmentStep() {
  const character = useForge((s) => s.character)
  const setPack = useForge((s) => s.setEquipmentPack)
  const cls = getClass(character)
  const race = getRace(character)
  const bg = character.backgroundId ? BACKGROUND_BY_ID[character.backgroundId] : null

  if (!cls) {
    return (
      <div>
        <StepHeading title="Снаряжение" />
        <p className="text-parchment-300/70">Сначала выберите класс.</p>
      </div>
    )
  }

  return (
    <div>
      <StepHeading
        title="Снаряжение"
        hint="Выберите готовый набор класса. Выбор влияет на КД в живом листе."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cls.equipmentPacks.map((pack) => (
          <SelectCard
            key={pack.id}
            selected={character.equipmentPackId === pack.id}
            onClick={() => setPack(pack.id)}
            title={pack.label}
          >
            <ul className="list-inside list-disc space-y-0.5">
              {pack.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </SelectCard>
        ))}
      </div>

      {bg && (
        <div className="card mt-4">
          <div className="mb-1 text-sm uppercase tracking-wider text-gold-300/80">
            Снаряжение предыстории ({bg.name})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {bg.equipment.map((it) => (
              <span key={it} className="chip">
                {it}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card mt-4">
        <div className="mb-1 text-sm uppercase tracking-wider text-gold-300/80">Владения</div>
        <div className="space-y-1 text-xs text-parchment-200/80">
          <div>
            <span className="text-gold-300/80">Доспехи:</span>{' '}
            {cls.armorProficiencies.join(', ') || '—'}
          </div>
          <div>
            <span className="text-gold-300/80">Оружие:</span> {cls.weaponProficiencies.join(', ')}
          </div>
          {cls.toolProficiencies && (
            <div>
              <span className="text-gold-300/80">Инструменты:</span>{' '}
              {cls.toolProficiencies.join(', ')}
            </div>
          )}
          <div>
            <span className="text-gold-300/80">Языки:</span> {race?.languages.join(', ') || '—'}
          </div>
        </div>
      </div>
    </div>
  )
}
