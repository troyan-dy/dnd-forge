import type { CharacterState } from '@/types'
import { createEmptyCharacter, SCHEMA_VERSION } from './store'

/** Serialize the character to a downloadable JSON file. */
export function exportCharacter(character: CharacterState): void {
  const data = JSON.stringify({ ...character, version: SCHEMA_VERSION }, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const safeName = (character.name || 'character').replace(/[^\p{L}\p{N}_-]+/gu, '_')
  a.href = url
  a.download = `dnd-forge-${safeName}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/** Parse + lightly validate an imported JSON character. */
export function parseCharacter(text: string): CharacterState | null {
  try {
    const raw = JSON.parse(text) as Partial<CharacterState>
    // Merge onto defaults so missing/old fields don't break the app.
    const merged: CharacterState = { ...createEmptyCharacter(), ...raw, version: SCHEMA_VERSION }
    // Minimal sanity checks.
    if (typeof merged.baseAbilities !== 'object' || merged.baseAbilities == null) return null
    return merged
  } catch {
    return null
  }
}
