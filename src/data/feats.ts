import type { Feat } from '@/types'

// A small SRD 5.1 feat subset offered at the level-4 ASI window.
export const FEATS: Feat[] = [
  {
    id: 'great-weapon-master',
    name: 'Мастер двуручного оружия',
    description: 'При крите/добивании — бонусная атака. Можно −5 к попаданию ради +10 к урону тяжёлым оружием.',
    synergyRoles: ['melee-dps'],
  },
  {
    id: 'sharpshooter',
    name: 'Меткий стрелок',
    description: 'Игнорируете укрытие и штраф за дальность; −5 к попаданию ради +10 урона дальнобойным оружием.',
    synergyRoles: ['ranged-dps'],
  },
  {
    id: 'tough',
    name: 'Стойкий',
    description: 'Максимум хитов увеличивается на 2 за каждый уровень (постоянный буст ОЗ).',
    synergyRoles: ['tank', 'melee-dps'],
  },
  {
    id: 'war-caster',
    name: 'Боевой заклинатель',
    description: 'Преимущество на спасброски концентрации; заклинания как атаки по возможности; чтение со свободными руками.',
    synergyRoles: ['controller', 'support'],
  },
  {
    id: 'resilient-con',
    name: 'Несгибаемый (Телосложение)',
    description: '+1 к Телосложению и владение спасбросками Телосложения — спасает концентрацию кастера.',
    abilityBonus: { con: 1 },
    synergyRoles: ['controller', 'support', 'tank'],
  },
  {
    id: 'lucky',
    name: 'Везунчик',
    description: 'Три раза в день перебрасываете d20 атаки, проверки или спасброска (или заставляете врага).',
    synergyRoles: ['skill-monkey', 'tank', 'melee-dps', 'ranged-dps', 'controller', 'support'],
  },
  {
    id: 'mobile',
    name: 'Подвижный',
    description: '+10 футов скорости; после атаки по существу не провоцируете от него атак — кайт и налёт.',
    synergyRoles: ['melee-dps', 'skill-monkey', 'ranged-dps'],
  },
]

export const FEAT_BY_ID: Record<string, Feat> = FEATS.reduce(
  (acc, f) => {
    acc[f.id] = f
    return acc
  },
  {} as Record<string, Feat>,
)
