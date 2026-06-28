import { useForge } from '@/lib/store'
import { BACKGROUNDS } from '@/data/backgrounds'
import { skillLabel } from '@/data/skills'
import { SelectCard, StepHeading } from '@/components/ui/SelectCard'

export function BackgroundStep() {
  const backgroundId = useForge((s) => s.character.backgroundId)
  const setBackground = useForge((s) => s.setBackground)

  return (
    <div>
      <StepHeading
        title="Предыстория"
        hint="Предыстория даёт два навыка, снаряжение, особенность и крючок для отыгрыша."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BACKGROUNDS.map((bg) => (
          <SelectCard
            key={bg.id}
            selected={backgroundId === bg.id}
            onClick={() => setBackground(bg.id)}
            title={bg.name}
            subtitle={bg.blurb}
            badges={bg.grantsSkills.map(skillLabel)}
          >
            <div>
              <span className="text-gold-300/80">{bg.feature.name}:</span> {bg.feature.description}
            </div>
            <div className="mt-1 italic text-parchment-300/60">«{bg.trait}»</div>
          </SelectCard>
        ))}
      </div>
    </div>
  )
}
