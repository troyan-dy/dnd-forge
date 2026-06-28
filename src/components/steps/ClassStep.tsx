import { useForge } from '@/lib/store'
import { CLASSES } from '@/data/classes'
import { ROLE_LABELS, COMPLEXITY_LABELS, ABILITY_SHORT } from '@/types'
import { SelectCard, StepHeading } from '@/components/ui/SelectCard'

export function ClassStep() {
  const classId = useForge((s) => s.character.classId)
  const setClass = useForge((s) => s.setClass)

  return (
    <div>
      <StepHeading
        title="Класс"
        hint="Класс — ядро билда: роль в группе, хиты, владения и заклинания. Подкласс выбран автоматически (один на класс)."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CLASSES.map((cls) => {
          const badges = [
            ROLE_LABELS[cls.role],
            COMPLEXITY_LABELS[cls.complexity],
            `d${cls.hitDie} ОЗ`,
            cls.isCaster ? 'Заклинатель' : 'Боец',
            `Основа: ${cls.primaryAbility.map((a) => ABILITY_SHORT[a]).join('/')}`,
          ]
          return (
            <SelectCard
              key={cls.id}
              selected={classId === cls.id}
              onClick={() => setClass(cls.id)}
              title={cls.name}
              subtitle={cls.blurb}
              badges={badges}
            >
              <div>
                <span className="text-gold-300/80">Подкласс:</span> {cls.subclass.name} —{' '}
                {cls.subclass.blurb}
              </div>
              <div className="mt-1">
                <span className="text-gold-300/80">Спасброски:</span>{' '}
                {cls.savingThrows.map((a) => ABILITY_SHORT[a]).join(', ')}
              </div>
            </SelectCard>
          )
        })}
      </div>
    </div>
  )
}
