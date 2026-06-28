import { useForge } from '@/lib/store'
import { ProgressBar } from '@/components/ProgressBar'
import { LiveSheet } from '@/components/LiveSheet'
import { WizardStep } from '@/components/WizardStep'
import { WizardNav } from '@/components/WizardNav'

export default function App() {
  const step = useForge((s) => s.step)
  const reset = useForge((s) => s.reset)
  const isSummary = step === 'summary'

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="no-print sticky top-0 z-20 border-b border-gold-600/30 bg-ink-900/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/forge.svg" alt="" className="h-9 w-9" />
            <div>
              <h1 className="font-display text-xl font-bold tracking-wide text-gold-300 sm:text-2xl">
                DnD Build Forge
              </h1>
              <p className="hidden text-xs text-parchment-300/70 sm:block">
                Конструктор персонажей D&D 5e · только SRD/CC-контент
              </p>
            </div>
          </div>
          <button
            className="btn-danger text-xs"
            onClick={() => {
              if (confirm('Создать нового персонажа? Текущий прогресс будет удалён.')) reset()
            }}
          >
            Новый персонаж
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-7xl px-3 py-5 sm:px-4">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Wizard column */}
          <section className={isSummary ? 'print-full order-2 lg:order-1' : 'order-2 lg:order-1'}>
            <ProgressBar />
            <div className="mt-4">
              <WizardStep />
            </div>
            <WizardNav />
          </section>

          {/* Live sheet (sticky on desktop, collapsible on mobile) */}
          <aside className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-20">
              <LiveSheet />
            </div>
          </aside>
        </div>

        <footer className="no-print mt-10 border-t border-gold-600/20 pt-4 text-center text-xs text-parchment-300/50">
          Контент основан на System Reference Document 5.1 (CC-BY-4.0, Wizards of the Coast).
          Работает полностью оффлайн. Сделано как учебный проект.
        </footer>
      </main>
    </div>
  )
}
