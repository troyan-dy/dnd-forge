import { useForge, visibleSteps, STEP_LABELS } from '@/lib/store'

export function ProgressBar() {
  const step = useForge((s) => s.step)
  const character = useForge((s) => s.character)
  const setStep = useForge((s) => s.setStep)
  const steps = visibleSteps(character)
  const currentIdx = steps.indexOf(step)
  const pct = Math.round((currentIdx / (steps.length - 1)) * 100)

  return (
    <div className="no-print">
      <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-600">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-300 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {steps.map((s, i) => {
          const active = s === step
          const done = i < currentIdx
          return (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={[
                'rounded-md px-2 py-1 text-[11px] font-display font-semibold tracking-wide transition-colors',
                active
                  ? 'bg-gold-400 text-ink-900'
                  : done
                    ? 'bg-ink-600 text-gold-300 hover:bg-ink-500'
                    : 'bg-ink-700 text-parchment-300/60 hover:bg-ink-600',
              ].join(' ')}
            >
              <span className="mr-1 opacity-60">{i + 1}</span>
              {STEP_LABELS[s]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
