import type { CharacterState, ClassFeature } from '@/types'
import { CLASS_BY_ID } from '@/data/classes'
import { proficiencyBonus } from './calculations'

// Full-caster spell slots per class level (SRD), levels 1–5, slot tiers 1–3.
const FULL_CASTER_SLOTS: Record<number, number[]> = {
  1: [2],
  2: [3],
  3: [4, 2],
  4: [4, 3],
  5: [4, 3, 2],
}

export function spellSlots(state: CharacterState): number[] {
  const cls = state.classId ? CLASS_BY_ID[state.classId] : null
  if (!cls || cls.casterType !== 'full') return []
  return FULL_CASTER_SLOTS[Math.min(5, Math.max(1, state.level))] ?? []
}

export interface LevelRow {
  level: number
  proficiency: number
  features: ClassFeature[]
  slots: number[]
  isASI: boolean
  isSubclass: boolean
}

/** Builds the 1→5 level track for the current class (+ subclass features). */
export function levelTrack(classId: string | null): LevelRow[] {
  const cls = classId ? CLASS_BY_ID[classId] : null
  const rows: LevelRow[] = []
  for (let lvl = 1; lvl <= 5; lvl++) {
    const classFeatures = cls?.features.filter((f) => f.level === lvl) ?? []
    const subFeatures = cls?.subclass.features.filter((f) => f.level === lvl) ?? []
    const features = [...classFeatures, ...subFeatures]
    rows.push({
      level: lvl,
      proficiency: proficiencyBonus(lvl),
      features,
      slots: cls?.casterType === 'full' ? FULL_CASTER_SLOTS[lvl] ?? [] : [],
      isASI: classFeatures.some((f) => f.isASI),
      isSubclass: classFeatures.some((f) => f.isSubclassChoice) || cls?.subclass.choiceLevel === lvl,
    })
  }
  return rows
}
