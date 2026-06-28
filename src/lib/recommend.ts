import type { Complexity, Role, SkillId } from '@/types'
import { CLASSES } from '@/data/classes'
import { RACES } from '@/data/races'
import { BACKGROUNDS } from '@/data/backgrounds'
import { skillLabel } from '@/data/skills'

export interface ReverseQuery {
  desiredSkills: SkillId[]
  role: Role | 'any'
  style: 'caster' | 'weapon' | 'mixed' | 'any'
  complexity: Complexity | 'any'
}

export interface SkillSourceInfo {
  skill: SkillId
  covered: boolean
  /** Human-readable source: "через Плут (выбор)" / "предыстория Преступник" / "раса Полуэльф". */
  source: string
}

export interface Recommendation {
  classId: string
  raceId: string
  backgroundId: string
  score: number
  /** 0–100 share of desired skills this combo can cover. */
  coverage: number
  skillSources: SkillSourceInfo[]
  uncovered: SkillId[]
  reasons: string[]
}

/**
 * Reverse filter. Intersects the player's wishes with the tags of every
 * CLASS × RACE × BACKGROUND combo and returns the top matches.
 *
 * Skill coverage respects pool budgets greedily (documented simplification):
 * auto-granted skills are free; pooled skills are assigned to class/race pools
 * until their pick-count runs out.
 */
function evaluateCombo(
  query: ReverseQuery,
  classId: string,
  raceId: string,
  backgroundId: string,
): Recommendation {
  const cls = CLASSES.find((c) => c.id === classId)!
  const race = RACES.find((r) => r.id === raceId)!
  const bg = BACKGROUNDS.find((b) => b.id === backgroundId)!

  // --- Skill coverage ------------------------------------------------------
  const auto = new Map<SkillId, string>()
  cls.grantsSkills?.forEach((s) => auto.set(s, `класс ${cls.name}`))
  bg.grantsSkills.forEach((s) => auto.set(s, `предыстория ${bg.name}`))
  race.grantsSkills?.forEach((s) => auto.set(s, `раса ${race.name}`))

  let classCap = cls.skillChoices?.count ?? 0
  let raceCap = race.skillChoices?.count ?? 0
  const classPool = new Set(cls.skillChoices?.pool ?? [])
  const racePool = new Set(race.skillChoices?.pool ?? [])

  const skillSources: SkillSourceInfo[] = []
  const uncovered: SkillId[] = []

  for (const skill of query.desiredSkills) {
    if (auto.has(skill)) {
      skillSources.push({ skill, covered: true, source: auto.get(skill)! })
    } else if (classPool.has(skill) && classCap > 0) {
      classCap--
      skillSources.push({ skill, covered: true, source: `через ${cls.name} (выбор)` })
    } else if (racePool.has(skill) && raceCap > 0) {
      raceCap--
      skillSources.push({ skill, covered: true, source: `раса ${race.name} (выбор)` })
    } else {
      skillSources.push({ skill, covered: false, source: 'недоступно в этой связке' })
      uncovered.push(skill)
    }
  }

  const desiredCount = query.desiredSkills.length || 1
  const coveredCount = skillSources.filter((s) => s.covered).length
  const coverage = Math.round((coveredCount / desiredCount) * 100)

  // --- Scoring -------------------------------------------------------------
  const reasons: string[] = []
  let score = coveredCount * 12

  if (query.desiredSkills.length) {
    reasons.push(`Навыки: ${coveredCount}/${query.desiredSkills.length}`)
  }

  if (query.role !== 'any') {
    if (cls.role === query.role) {
      score += 18
      reasons.push('Роль точно совпадает')
    } else if (cls.secondaryRoles?.includes(query.role)) {
      score += 8
      reasons.push('Роль доступна как вторичная')
    }
  }

  if (query.style !== 'any') {
    if (query.style === 'caster' && cls.isCaster) {
      score += 12
      reasons.push('Полноценный кастер')
    } else if (query.style === 'weapon' && !cls.isCaster) {
      score += 12
      reasons.push('Боец оружием')
    } else if (query.style === 'mixed' && cls.isCaster && cls.weaponProficiencies.length > 2) {
      score += 12
      reasons.push('Смешанный стиль (магия + оружие)')
    }
  }

  if (query.complexity !== 'any' && cls.complexity === query.complexity) {
    score += 10
    reasons.push('Сложность как просили')
  }

  // Small synergy bonus: primary ability vs race bonuses.
  const raceBoostsPrimary = cls.primaryAbility.some((a) => (race.abilityBonuses[a] ?? 0) > 0)
  if (raceBoostsPrimary) {
    score += 6
    reasons.push(`Раса усиливает основную характеристику`)
  }

  return { classId, raceId, backgroundId, score, coverage, skillSources, uncovered, reasons }
}

export interface ReverseResult {
  top: Recommendation[]
  /** Skills no combo could cover at all, with nearest alternative hint. */
  unreachable: { skill: SkillId; hint: string }[]
}

export function recommend(query: ReverseQuery): ReverseResult {
  const all: Recommendation[] = []
  for (const cls of CLASSES) {
    for (const race of RACES) {
      for (const bg of BACKGROUNDS) {
        all.push(evaluateCombo(query, cls.id, race.id, bg.id))
      }
    }
  }

  all.sort((a, b) => b.score - a.score || b.coverage - a.coverage)

  // De-duplicate by class so the top-3 aren't three reskins of one class.
  const top: Recommendation[] = []
  const seenClasses = new Set<string>()
  for (const rec of all) {
    if (seenClasses.has(rec.classId)) continue
    seenClasses.add(rec.classId)
    top.push(rec)
    if (top.length === 3) break
  }

  // Which desired skills can NO combo cover? (e.g. a skill not in any pool/grant)
  const unreachable: { skill: SkillId; hint: string }[] = []
  for (const skill of query.desiredSkills) {
    const coverableSomewhere = all.some((r) =>
      r.skillSources.some((s) => s.skill === skill && s.covered),
    )
    if (!coverableSomewhere) {
      unreachable.push({ skill, hint: 'ни одна связка не даёт этот навык напрямую' })
    } else {
      // Reachable globally but missing from the top pick → suggest where to find it.
      const inTop = top.some((r) => r.skillSources.some((s) => s.skill === skill && s.covered))
      if (!inTop) {
        const alt = all.find((r) => r.skillSources.some((s) => s.skill === skill && s.covered))
        if (alt) {
          const cls = CLASSES.find((c) => c.id === alt.classId)!
          unreachable.push({
            skill,
            hint: `доступен, например, через класс ${cls.name} — рассмотрите как альтернативу`,
          })
        }
      }
    }
  }

  return { top, unreachable }
}

export { skillLabel }
