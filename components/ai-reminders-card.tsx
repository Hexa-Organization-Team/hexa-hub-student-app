import { Sparkles } from 'lucide-react'
import { ProgressRing } from './progress-ring'

type AiRemindersCardProps = {
  completed: number
  total: number
}

export function AiRemindersCard({ completed, total }: AiRemindersCardProps) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <section
      aria-labelledby="ai-card-title"
      className="relative overflow-hidden rounded-3xl bg-card p-5 ring-1 ring-border"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />

      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-full bg-primary/15">
          <Sparkles className="size-4 text-primary" aria-hidden />
        </span>
        <h2 id="ai-card-title" className="font-display text-base font-semibold">
          Promemoria AI
        </h2>
      </div>

      <div className="mt-5 flex items-center gap-5">
        <ProgressRing value={percent}>
          <span className="font-display text-2xl font-bold leading-none">{percent}%</span>
          <span className="mt-1 text-[11px] text-muted-foreground">obiettivo</span>
        </ProgressRing>

        <div className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            Hai completato{' '}
            <span className="font-semibold text-foreground">
              {completed} di {total}
            </span>{' '}
            obiettivi di studio. Continua così per mantenere la streak!
          </p>
          <div className="flex items-start gap-2 rounded-xl bg-secondary/60 px-3 py-2.5">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
            <p className="text-xs leading-relaxed text-foreground/90">
              Suggerimento: ripassa Latino stasera, la verifica è tra 2 giorni.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
