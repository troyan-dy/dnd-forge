import { useForge } from '@/lib/store'
import { HelpStep } from '@/components/steps/HelpStep'
import { RaceStep } from '@/components/steps/RaceStep'
import { ClassStep } from '@/components/steps/ClassStep'
import { AbilitiesStep } from '@/components/steps/AbilitiesStep'
import { BackgroundStep } from '@/components/steps/BackgroundStep'
import { SkillsStep } from '@/components/steps/SkillsStep'
import { EquipmentStep } from '@/components/steps/EquipmentStep'
import { SpellsStep } from '@/components/steps/SpellsStep'
import { LevelStep } from '@/components/steps/LevelStep'
import { SummaryStep } from '@/components/steps/SummaryStep'

export function WizardStep() {
  const step = useForge((s) => s.step)
  switch (step) {
    case 'help':
      return <HelpStep />
    case 'race':
      return <RaceStep />
    case 'class':
      return <ClassStep />
    case 'abilities':
      return <AbilitiesStep />
    case 'background':
      return <BackgroundStep />
    case 'skills':
      return <SkillsStep />
    case 'equipment':
      return <EquipmentStep />
    case 'spells':
      return <SpellsStep />
    case 'level':
      return <LevelStep />
    case 'summary':
      return <SummaryStep />
    default:
      return null
  }
}
