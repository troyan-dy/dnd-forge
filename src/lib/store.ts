import { create } from 'zustand'
import type {
  Ability,
  AbilityMode,
  CharacterState,
  Level4Choice,
  SkillId,
} from '@/types'
import { loadJSON, saveJSON, removeKey } from './storage'

export const SCHEMA_VERSION = 1

export const DEFAULT_ABILITIES: Record<Ability, number> = {
  str: 10,
  dex: 10,
  con: 10,
  int: 10,
  wis: 10,
  cha: 10,
}

export function createEmptyCharacter(): CharacterState {
  return {
    version: SCHEMA_VERSION,
    name: '',
    raceId: null,
    classId: null,
    subclassId: null,
    backgroundId: null,
    abilityMode: 'pointbuy',
    baseAbilities: { ...DEFAULT_ABILITIES },
    raceFlexBonus: {},
    classSkillChoices: [],
    raceSkillChoices: [],
    equipmentPackId: null,
    knownCantrips: [],
    knownSpells: [],
    level: 1,
    level4Choice: { kind: 'none' },
  }
}

// Wizard steps in flow order. "help" is the optional reverse-filter intro screen.
export const STEPS = [
  'help',
  'race',
  'class',
  'abilities',
  'background',
  'skills',
  'equipment',
  'spells',
  'level',
  'summary',
] as const
export type Step = (typeof STEPS)[number]

export const STEP_LABELS: Record<Step, string> = {
  help: 'Помощь',
  race: 'Раса',
  class: 'Класс',
  abilities: 'Характеристики',
  background: 'Предыстория',
  skills: 'Навыки',
  equipment: 'Снаряжение',
  spells: 'Заклинания',
  level: 'Прокачка',
  summary: 'Итог',
}

interface ForgeStore {
  character: CharacterState
  step: Step
  // navigation
  setStep: (step: Step) => void
  next: () => void
  prev: () => void
  // mutations
  patch: (partial: Partial<CharacterState>) => void
  setRace: (raceId: string) => void
  setClass: (classId: string) => void
  setBackground: (backgroundId: string) => void
  setAbilityMode: (mode: AbilityMode) => void
  setBaseAbility: (ability: Ability, value: number) => void
  setBaseAbilities: (values: Record<Ability, number>) => void
  setRaceFlex: (bonus: Partial<Record<Ability, number>>) => void
  toggleClassSkill: (skill: SkillId, max: number) => void
  toggleRaceSkill: (skill: SkillId, max: number) => void
  setEquipmentPack: (id: string) => void
  toggleCantrip: (id: string, max: number) => void
  toggleSpell: (id: string, max: number) => void
  setLevel: (level: number) => void
  setLevel4Choice: (choice: Level4Choice) => void
  loadCharacter: (c: CharacterState) => void
  reset: () => void
}

const STORAGE_KEY = 'character'
const STEP_KEY = 'step'

/** Visible steps depend on whether the class is a caster. */
export function visibleSteps(character: CharacterState): Step[] {
  const isCaster = character.classId
    ? ['wizard', 'cleric', 'bard'].includes(character.classId)
    : false
  return STEPS.filter((s) => (s === 'spells' ? isCaster : true))
}

function migrate(c: CharacterState): CharacterState {
  // Merge with defaults so older/partial saves don't crash the UI.
  return { ...createEmptyCharacter(), ...c, version: SCHEMA_VERSION }
}

const persistedCharacter = loadJSON<CharacterState>(STORAGE_KEY)
const persistedStep = loadJSON<Step>(STEP_KEY)

export const useForge = create<ForgeStore>((set, get) => {
  const persist = (character: CharacterState) => saveJSON(STORAGE_KEY, character)

  return {
    character: persistedCharacter ? migrate(persistedCharacter) : createEmptyCharacter(),
    step: persistedStep && STEPS.includes(persistedStep) ? persistedStep : 'help',

    setStep: (step) => {
      saveJSON(STEP_KEY, step)
      set({ step })
    },

    next: () => {
      const { step, character } = get()
      const steps = visibleSteps(character)
      const idx = steps.indexOf(step)
      const nextStep = steps[Math.min(idx + 1, steps.length - 1)]
      saveJSON(STEP_KEY, nextStep)
      set({ step: nextStep })
    },

    prev: () => {
      const { step, character } = get()
      const steps = visibleSteps(character)
      const idx = steps.indexOf(step)
      const prevStep = steps[Math.max(idx - 1, 0)]
      saveJSON(STEP_KEY, prevStep)
      set({ step: prevStep })
    },

    patch: (partial) => {
      const character = { ...get().character, ...partial }
      persist(character)
      set({ character })
    },

    setRace: (raceId) => {
      const character = { ...get().character, raceId, raceSkillChoices: [], raceFlexBonus: {} }
      persist(character)
      set({ character })
    },

    setClass: (classId) => {
      const cls = classId
      // Reset class-bound choices when class changes.
      const character = {
        ...get().character,
        classId: cls,
        subclassId: null,
        classSkillChoices: [],
        equipmentPackId: null,
        knownCantrips: [],
        knownSpells: [],
      }
      persist(character)
      set({ character })
    },

    setBackground: (backgroundId) => {
      const character = { ...get().character, backgroundId }
      persist(character)
      set({ character })
    },

    setAbilityMode: (mode) => {
      const character = { ...get().character, abilityMode: mode }
      persist(character)
      set({ character })
    },

    setBaseAbility: (ability, value) => {
      const character = {
        ...get().character,
        baseAbilities: { ...get().character.baseAbilities, [ability]: value },
      }
      persist(character)
      set({ character })
    },

    setBaseAbilities: (values) => {
      const character = { ...get().character, baseAbilities: { ...values } }
      persist(character)
      set({ character })
    },

    setRaceFlex: (bonus) => {
      const character = { ...get().character, raceFlexBonus: bonus }
      persist(character)
      set({ character })
    },

    toggleClassSkill: (skill, max) => {
      const cur = get().character.classSkillChoices
      let next: SkillId[]
      if (cur.includes(skill)) next = cur.filter((s) => s !== skill)
      else if (cur.length < max) next = [...cur, skill]
      else return
      const character = { ...get().character, classSkillChoices: next }
      persist(character)
      set({ character })
    },

    toggleRaceSkill: (skill, max) => {
      const cur = get().character.raceSkillChoices
      let next: SkillId[]
      if (cur.includes(skill)) next = cur.filter((s) => s !== skill)
      else if (cur.length < max) next = [...cur, skill]
      else return
      const character = { ...get().character, raceSkillChoices: next }
      persist(character)
      set({ character })
    },

    setEquipmentPack: (id) => {
      const character = { ...get().character, equipmentPackId: id }
      persist(character)
      set({ character })
    },

    toggleCantrip: (id, max) => {
      const cur = get().character.knownCantrips
      let next: string[]
      if (cur.includes(id)) next = cur.filter((s) => s !== id)
      else if (cur.length < max) next = [...cur, id]
      else return
      const character = { ...get().character, knownCantrips: next }
      persist(character)
      set({ character })
    },

    toggleSpell: (id, max) => {
      const cur = get().character.knownSpells
      let next: string[]
      if (cur.includes(id)) next = cur.filter((s) => s !== id)
      else if (cur.length < max) next = [...cur, id]
      else return
      const character = { ...get().character, knownSpells: next }
      persist(character)
      set({ character })
    },

    setLevel: (level) => {
      const character = { ...get().character, level }
      persist(character)
      set({ character })
    },

    setLevel4Choice: (choice) => {
      const character = { ...get().character, level4Choice: choice }
      persist(character)
      set({ character })
    },

    loadCharacter: (c) => {
      const character = migrate(c)
      persist(character)
      set({ character, step: 'summary' })
      saveJSON(STEP_KEY, 'summary')
    },

    reset: () => {
      const character = createEmptyCharacter()
      removeKey(STORAGE_KEY)
      removeKey(STEP_KEY)
      set({ character, step: 'help' })
    },
  }
})
