// ============================================================================
// DnD Build Forge — core type definitions
// Only SRD 5.1 (CC-BY-4.0) content is modelled here so the project is freely
// publishable. Where SRD is thin we simplify (documented in README).
// ============================================================================

/** The six core ability scores. */
export type Ability = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'

export const ABILITIES: Ability[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

export const ABILITY_LABELS: Record<Ability, string> = {
  str: 'Сила',
  dex: 'Ловкость',
  con: 'Телосложение',
  int: 'Интеллект',
  wis: 'Мудрость',
  cha: 'Харизма',
}

export const ABILITY_SHORT: Record<Ability, string> = {
  str: 'СИЛ',
  dex: 'ЛОВ',
  con: 'ТЕЛ',
  int: 'ИНТ',
  wis: 'МДР',
  cha: 'ХАР',
}

/** All 18 SRD skills, keyed by id, each tied to a governing ability. */
export type SkillId =
  | 'acrobatics'
  | 'animalHandling'
  | 'arcana'
  | 'athletics'
  | 'deception'
  | 'history'
  | 'insight'
  | 'intimidation'
  | 'investigation'
  | 'medicine'
  | 'nature'
  | 'perception'
  | 'performance'
  | 'persuasion'
  | 'religion'
  | 'sleightOfHand'
  | 'stealth'
  | 'survival'

export interface SkillDef {
  id: SkillId
  label: string
  ability: Ability
}

/** A combat/party role tag — the backbone of the reverse filter & guide. */
export type Role =
  | 'tank'
  | 'melee-dps'
  | 'ranged-dps'
  | 'support'
  | 'controller'
  | 'skill-monkey'

export const ROLE_LABELS: Record<Role, string> = {
  tank: 'Танк',
  'melee-dps': 'Ближний урон',
  'ranged-dps': 'Дальний урон',
  support: 'Поддержка',
  controller: 'Контроль',
  'skill-monkey': 'Универсал-навыки',
}

export type Complexity = 'simple' | 'medium' | 'complex'

export const COMPLEXITY_LABELS: Record<Complexity, string> = {
  simple: 'Простой',
  medium: 'Средний',
  complex: 'Сложный',
}

/** A pool-based skill choice ("choose N from pool"). */
export interface SkillChoice {
  /** Number of skills the player may pick from the pool. */
  count: number
  /** Eligible skills. */
  pool: SkillId[]
}

// ----------------------------------------------------------------------------
// Race
// ----------------------------------------------------------------------------

export interface RaceTrait {
  name: string
  description: string
}

export interface Race {
  id: string
  name: string
  /** Flavor blurb shown in the picker. */
  blurb: string
  /** Flat ability score bonuses from the race. */
  abilityBonuses: Partial<Record<Ability, number>>
  speed: number
  size: 'Small' | 'Medium'
  darkvision: number // 0 = none, otherwise range in feet
  traits: RaceTrait[]
  languages: string[]
  /** Damage resistances granted (e.g. "Урон огнём"). */
  resistances?: string[]
  /** Skills the race always grants. */
  grantsSkills?: SkillId[]
  /** Skills the race lets you choose (e.g. Half-Elf). */
  skillChoices?: SkillChoice
  /** For half-elf style flexible bonuses: choose N abilities to bump by 1. */
  flexibleAbilityBonus?: { count: number; amount: number; exclude?: Ability[] }
}

// ----------------------------------------------------------------------------
// Class & subclass
// ----------------------------------------------------------------------------

export interface ClassFeature {
  level: number
  name: string
  description: string
  /** Marks an Ability Score Improvement / Feat window. */
  isASI?: boolean
  /** Marks the level where you pick a subclass. */
  isSubclassChoice?: boolean
}

export interface Subclass {
  id: string
  name: string
  blurb: string
  /** Canonical level at which this subclass is chosen. */
  choiceLevel: number
  features: ClassFeature[]
}

export interface EquipmentPack {
  id: string
  label: string
  items: string[]
}

export interface CharClass {
  id: string
  name: string
  blurb: string
  hitDie: number // e.g. 10 -> d10
  primaryAbility: Ability[]
  savingThrows: Ability[]
  armorProficiencies: string[]
  weaponProficiencies: string[]
  toolProficiencies?: string[]
  isCaster: boolean
  /** Caster progression for slot/spell math. */
  casterType?: 'full' | 'half' | 'none'
  /** Ability used to cast spells. */
  spellAbility?: Ability
  role: Role
  /** Secondary roles this class can flex into (helps the reverse filter). */
  secondaryRoles?: Role[]
  complexity: Complexity
  grantsSkills?: SkillId[]
  skillChoices?: SkillChoice
  equipmentPacks: EquipmentPack[]
  /** Class features for levels 1–5. */
  features: ClassFeature[]
  subclass: Subclass
  /** Cantrips known at level 1 (casters). */
  cantripsKnown1?: number
  /** Level-1 spells known/prepared budget (simplified). */
  spellsKnown1?: number
}

// ----------------------------------------------------------------------------
// Background
// ----------------------------------------------------------------------------

export interface Background {
  id: string
  name: string
  blurb: string
  grantsSkills: SkillId[]
  languages: number // number of free languages
  toolProficiencies?: string[]
  equipment: string[]
  feature: { name: string; description: string }
  /** Suggested personality hooks for roleplay. */
  trait: string
}

// ----------------------------------------------------------------------------
// Spells
// ----------------------------------------------------------------------------

export interface Spell {
  id: string
  name: string
  level: number // 0 = cantrip
  school: string
  castingTime: string
  range: string
  duration: string
  concentration: boolean
  description: string
  /** Class ids that can learn this spell (SRD lists). */
  classes: string[]
  /** Tag used by the guide engine: 'damage' | 'control' | 'utility' | 'healing' | 'buff'. */
  spellTags: SpellTag[]
}

export type SpellTag = 'damage' | 'control' | 'utility' | 'healing' | 'buff' | 'defense'

// ----------------------------------------------------------------------------
// Feats (SRD subset)
// ----------------------------------------------------------------------------

export interface Feat {
  id: string
  name: string
  description: string
  /** Ability bumps some half-feats grant. */
  abilityBonus?: Partial<Record<Ability, number>>
  /** Roles this feat synergizes with — used by the guide & filter. */
  synergyRoles: Role[]
}

// ----------------------------------------------------------------------------
// Character (the working build saved to localStorage)
// ----------------------------------------------------------------------------

export type AbilityMode = 'pointbuy' | 'standard' | 'roll'

export type Level4Choice =
  | { kind: 'asi'; abilities: Partial<Record<Ability, number>> }
  | { kind: 'feat'; featId: string }
  | { kind: 'none' }

export interface CharacterState {
  /** Schema version for import/export compatibility. */
  version: number
  name: string
  raceId: string | null
  classId: string | null
  /** Subclass is auto-bound to class but stored to allow future multi-subclass. */
  subclassId: string | null
  backgroundId: string | null
  abilityMode: AbilityMode
  /** Base ability scores BEFORE racial bonuses. */
  baseAbilities: Record<Ability, number>
  /** Half-elf style chosen flexible ability bumps (race). */
  raceFlexBonus: Partial<Record<Ability, number>>
  /** Skills chosen from the class pool. */
  classSkillChoices: SkillId[]
  /** Skills chosen from the race pool (half-elf). */
  raceSkillChoices: SkillId[]
  /** Selected equipment pack id per class. */
  equipmentPackId: string | null
  /** Chosen cantrip + level-1 spell ids. */
  knownCantrips: string[]
  knownSpells: string[]
  /** Target build level for the level track (1–5). */
  level: number
  /** Level-4 ASI/feat decision. */
  level4Choice: Level4Choice
}
