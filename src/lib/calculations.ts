import type { Ability, CharacterState, Race, CharClass, SkillId } from '@/types'
import { ABILITIES } from '@/types'
import { RACE_BY_ID } from '@/data/races'
import { CLASS_BY_ID } from '@/data/classes'
import { BACKGROUND_BY_ID } from '@/data/backgrounds'
import { FEAT_BY_ID } from '@/data/feats'
import { SKILL_BY_ID } from '@/data/skills'

export const abilityModifier = (score: number): number => Math.floor((score - 10) / 2)

export const formatModifier = (mod: number): string => (mod >= 0 ? `+${mod}` : `${mod}`)

/** SRD proficiency bonus progression (levels 1–20). */
export const proficiencyBonus = (level: number): number => Math.floor((level - 1) / 4) + 2

/**
 * Final ability scores = base + racial bonuses + half-elf flex + level-4 ASI/feat.
 * Pure function: same inputs -> same output, so the live sheet recomputes reactively.
 */
export function finalAbilities(state: CharacterState): Record<Ability, number> {
  const race = state.raceId ? RACE_BY_ID[state.raceId] : null
  const result = { ...state.baseAbilities }

  if (race) {
    for (const ab of ABILITIES) {
      result[ab] += race.abilityBonuses[ab] ?? 0
    }
    if (race.flexibleAbilityBonus) {
      for (const ab of ABILITIES) {
        result[ab] += state.raceFlexBonus[ab] ?? 0
      }
    }
  }

  // Level-4 ASI / feat ability bumps (only once the build reaches level 4).
  if (state.level >= 4) {
    if (state.level4Choice.kind === 'asi') {
      for (const ab of ABILITIES) {
        result[ab] += state.level4Choice.abilities[ab] ?? 0
      }
    } else if (state.level4Choice.kind === 'feat') {
      const feat = FEAT_BY_ID[state.level4Choice.featId]
      if (feat?.abilityBonus) {
        for (const ab of ABILITIES) {
          result[ab] += feat.abilityBonus[ab] ?? 0
        }
      }
    }
  }

  // Cap at 20 per SRD.
  for (const ab of ABILITIES) {
    result[ab] = Math.min(20, result[ab])
  }
  return result
}

/** All skills the character is proficient in, with their source for display. */
export interface SkillSource {
  skill: SkillId
  sources: string[]
  expertise: boolean
}

export function proficientSkills(state: CharacterState): Map<SkillId, SkillSource> {
  const map = new Map<SkillId, SkillSource>()
  const add = (skill: SkillId, source: string) => {
    const existing = map.get(skill)
    if (existing) existing.sources.push(source)
    else map.set(skill, { skill, sources: [source], expertise: false })
  }

  const race = state.raceId ? RACE_BY_ID[state.raceId] : null
  const cls = state.classId ? CLASS_BY_ID[state.classId] : null
  const bg = state.backgroundId ? BACKGROUND_BY_ID[state.backgroundId] : null

  race?.grantsSkills?.forEach((s) => add(s, `раса ${race.name}`))
  state.raceSkillChoices.forEach((s) => add(s, `раса ${race?.name ?? ''} (выбор)`))
  cls?.grantsSkills?.forEach((s) => add(s, `класс ${cls.name}`))
  state.classSkillChoices.forEach((s) => add(s, `класс ${cls?.name ?? ''} (выбор)`))
  bg?.grantsSkills.forEach((s) => add(s, `предыстория ${bg.name}`))

  // Rogue expertise (SRD level 1): apply to the first two chosen class skills.
  // Documented simplification — the picker order determines expertise.
  if (cls?.id === 'rogue') {
    state.classSkillChoices.slice(0, 2).forEach((s) => {
      const entry = map.get(s)
      if (entry) entry.expertise = true
    })
  }

  return map
}

export interface SkillRow {
  skill: SkillId
  label: string
  ability: Ability
  proficient: boolean
  expertise: boolean
  modifier: number
  sources: string[]
}

export function skillRows(state: CharacterState): SkillRow[] {
  const abilities = finalAbilities(state)
  const prof = proficiencyBonus(state.level)
  const profMap = proficientSkills(state)

  return Object.values(SKILL_BY_ID)
    .map((def) => {
      const src = profMap.get(def.id)
      const base = abilityModifier(abilities[def.ability])
      const profPart = src ? (src.expertise ? prof * 2 : prof) : 0
      return {
        skill: def.id,
        label: def.label,
        ability: def.ability,
        proficient: !!src,
        expertise: src?.expertise ?? false,
        modifier: base + profPart,
        sources: src?.sources ?? [],
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label, 'ru'))
}

/** Saving throw modifiers for all six abilities. */
export function savingThrows(state: CharacterState): Record<Ability, { mod: number; proficient: boolean }> {
  const abilities = finalAbilities(state)
  const prof = proficiencyBonus(state.level)
  const cls = state.classId ? CLASS_BY_ID[state.classId] : null
  const profSaves = new Set(cls?.savingThrows ?? [])

  const result = {} as Record<Ability, { mod: number; proficient: boolean }>
  for (const ab of ABILITIES) {
    const isProf = profSaves.has(ab)
    result[ab] = {
      mod: abilityModifier(abilities[ab]) + (isProf ? prof : 0),
      proficient: isProf,
    }
  }
  return result
}

/** Maximum HP using fixed average HP per level (SRD standard option). */
export function maxHp(state: CharacterState): number {
  const cls = state.classId ? CLASS_BY_ID[state.classId] : null
  if (!cls) return 0
  const abilities = finalAbilities(state)
  const conMod = abilityModifier(abilities.con)
  const L = state.level
  const avgPerLevel = cls.hitDie / 2 + 1
  const hp = cls.hitDie + conMod + (L - 1) * (avgPerLevel + conMod)

  // Tough feat: +2 HP per level.
  let bonus = 0
  if (state.level >= 4 && state.level4Choice.kind === 'feat' && state.level4Choice.featId === 'tough') {
    bonus = 2 * L
  }
  return Math.max(1, hp + bonus)
}

const ARMOR_TABLE: { match: string; base: number; addDex: boolean; maxDex?: number }[] = [
  { match: 'Кольчуга', base: 16, addDex: false },
  { match: 'Кольчужная рубаха', base: 13, addDex: true, maxDex: 2 },
  { match: 'Кожаный', base: 11, addDex: true },
]

/** Armor Class derived from the chosen equipment pack + class features. */
export function armorClass(state: CharacterState): { value: number; note: string } {
  const cls = state.classId ? CLASS_BY_ID[state.classId] : null
  const abilities = finalAbilities(state)
  const dex = abilityModifier(abilities.dex)
  const con = abilityModifier(abilities.con)
  if (!cls) return { value: 10 + dex, note: 'Без снаряжения' }

  const pack = cls.equipmentPacks.find((p) => p.id === state.equipmentPackId)
  const items = pack?.items ?? []
  const hasShield = items.some((i) => i.includes('Щит'))
  const shieldBonus = hasShield ? 2 : 0

  // Barbarian unarmored defense (no body armor in their packs).
  if (cls.id === 'barbarian') {
    return { value: 10 + dex + con + shieldBonus, note: 'Защита без доспехов (10 + ЛОВ + ТЕЛ)' }
  }

  // Find best matching armor in the pack.
  for (const armor of ARMOR_TABLE) {
    if (items.some((i) => i.includes(armor.match))) {
      const dexPart = armor.addDex ? (armor.maxDex !== undefined ? Math.min(dex, armor.maxDex) : dex) : 0
      return { value: armor.base + dexPart + shieldBonus, note: hasShield ? `${armor.match} + щит` : armor.match }
    }
  }

  // Wizard with Mage Armor known.
  if (state.knownSpells.includes('mage-armor')) {
    return { value: 13 + dex + shieldBonus, note: 'Доспехи мага (13 + ЛОВ)' }
  }

  return { value: 10 + dex + shieldBonus, note: 'Без доспеха (10 + ЛОВ)' }
}

export function initiative(state: CharacterState): number {
  return abilityModifier(finalAbilities(state).dex)
}

export function speed(state: CharacterState): number {
  const race = state.raceId ? RACE_BY_ID[state.raceId] : null
  let s = race?.speed ?? 30
  if (state.classId === 'barbarian' && state.level >= 5) s += 10 // Fast Movement
  return s
}

/** The spell save DC and attack bonus for casters. */
export function spellcasting(state: CharacterState): { dc: number; attack: number; ability: Ability } | null {
  const cls = state.classId ? CLASS_BY_ID[state.classId] : null
  if (!cls || !cls.isCaster || !cls.spellAbility) return null
  const abilities = finalAbilities(state)
  const mod = abilityModifier(abilities[cls.spellAbility])
  const prof = proficiencyBonus(state.level)
  return { dc: 8 + prof + mod, attack: prof + mod, ability: cls.spellAbility }
}

export const getRace = (state: CharacterState): Race | null =>
  state.raceId ? RACE_BY_ID[state.raceId] : null
export const getClass = (state: CharacterState): CharClass | null =>
  state.classId ? CLASS_BY_ID[state.classId] : null
