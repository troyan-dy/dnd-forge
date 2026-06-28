import { useForge } from '@/lib/store'
import { RACES } from '@/data/races'
import { ABILITY_SHORT } from '@/types'
import { SelectCard, StepHeading } from '@/components/ui/SelectCard'

export function RaceStep() {
  const raceId = useForge((s) => s.character.raceId)
  const setRace = useForge((s) => s.setRace)

  return (
    <div>
      <StepHeading
        title="Раса"
        hint="Раса задаёт бонусы характеристик, скорость и особенности. Навыков раса даёт мало — основной их источник класс и предыстория."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {RACES.map((race) => {
          const bonuses = Object.entries(race.abilityBonuses)
            .map(([ab, v]) => `${ABILITY_SHORT[ab as keyof typeof ABILITY_SHORT]} +${v}`)
            .join(', ')
          const badges = [
            bonuses,
            `Скорость ${race.speed}`,
            race.darkvision ? `Тёмное зрение ${race.darkvision}` : '',
            ...(race.grantsSkills?.length ? ['Даёт навык'] : []),
            ...(race.skillChoices ? [`+${race.skillChoices.count} навыка на выбор`] : []),
          ].filter(Boolean)
          return (
            <SelectCard
              key={race.id}
              selected={raceId === race.id}
              onClick={() => setRace(race.id)}
              title={race.name}
              subtitle={race.blurb}
              badges={badges}
            >
              <ul className="space-y-0.5">
                {race.traits.slice(0, 3).map((t) => (
                  <li key={t.name}>
                    <span className="text-gold-300/80">{t.name}:</span> {t.description}
                  </li>
                ))}
              </ul>
            </SelectCard>
          )
        })}
      </div>
    </div>
  )
}
