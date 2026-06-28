import { useForge, visibleSteps } from '@/lib/store'

export function WizardNav() {
  const step = useForge((s) => s.step)
  const character = useForge((s) => s.character)
  const next = useForge((s) => s.next)
  const prev = useForge((s) => s.prev)
  const steps = visibleSteps(character)
  const idx = steps.indexOf(step)
  const isFirst = idx === 0
  const isLast = idx === steps.length - 1

  if (step === 'summary') return null

  return (
    <div className="no-print mt-5 flex items-center justify-between">
      <button className="btn-ghost" onClick={prev} disabled={isFirst}>
        ← Назад
      </button>
      <span className="text-xs text-parchment-300/50">
        Шаг {idx + 1} из {steps.length}
      </span>
      <button className="btn-primary" onClick={next} disabled={isLast}>
        Далее →
      </button>
    </div>
  )
}
