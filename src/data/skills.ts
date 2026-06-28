import type { SkillDef, SkillId } from '@/types'

// The 18 SRD skills with their governing abilities.
export const SKILLS: SkillDef[] = [
  { id: 'acrobatics', label: 'Акробатика', ability: 'dex' },
  { id: 'animalHandling', label: 'Уход за животными', ability: 'wis' },
  { id: 'arcana', label: 'Магия', ability: 'int' },
  { id: 'athletics', label: 'Атлетика', ability: 'str' },
  { id: 'deception', label: 'Обман', ability: 'cha' },
  { id: 'history', label: 'История', ability: 'int' },
  { id: 'insight', label: 'Проницательность', ability: 'wis' },
  { id: 'intimidation', label: 'Запугивание', ability: 'cha' },
  { id: 'investigation', label: 'Анализ', ability: 'int' },
  { id: 'medicine', label: 'Медицина', ability: 'wis' },
  { id: 'nature', label: 'Природа', ability: 'int' },
  { id: 'perception', label: 'Внимательность', ability: 'wis' },
  { id: 'performance', label: 'Выступление', ability: 'cha' },
  { id: 'persuasion', label: 'Убеждение', ability: 'cha' },
  { id: 'religion', label: 'Религия', ability: 'int' },
  { id: 'sleightOfHand', label: 'Ловкость рук', ability: 'dex' },
  { id: 'stealth', label: 'Скрытность', ability: 'dex' },
  { id: 'survival', label: 'Выживание', ability: 'wis' },
]

export const SKILL_BY_ID: Record<SkillId, SkillDef> = SKILLS.reduce(
  (acc, s) => {
    acc[s.id] = s
    return acc
  },
  {} as Record<SkillId, SkillDef>,
)

export const skillLabel = (id: SkillId): string => SKILL_BY_ID[id]?.label ?? id
