import { Flame } from 'lucide-react'

const days = ['L', 'M', 'M', 'G', 'V', 'S', 'D']

export function PlannerHeader() {
  const today = new Date()
  const dateLabel = new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(today)

  // Convert JS Sunday-first day (0..6) to Monday-first index (0..6)
  const todayIndex = (today.getDay() + 6) % 7
  // Days up to and including today are part of the active streak
  const weekActivity = days.map((_, i) => i <= todayIndex)

  return (
    <header className="flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Ciao, Marco</p>
          <h1 className="font-display text-2xl font-semibold leading-tight text-balance">
            Oggi
          </h1>
          <p className="text-sm capitalize text-muted-foreground">{dateLabel}</p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-streak/12 px-3.5 py-2 ring-1 ring-streak/25">
          <Flame className="size-4 text-streak" aria-hidden />
          <span className="text-sm font-semibold text-streak">12</span>
          <span className="sr-only">giorni di streak</span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-card/60 px-3 py-3 ring-1 ring-border">
        {days.map((d, i) => {
          const active = weekActivity[i]
          const isToday = i === todayIndex
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-[11px] font-medium text-muted-foreground">{d}</span>
              <span
                className={[
                  'flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                  active
                    ? 'bg-streak/20 text-streak'
                    : 'bg-secondary text-muted-foreground',
                  isToday ? 'ring-2 ring-streak ring-offset-2 ring-offset-background' : '',
                ].join(' ')}
              >
                {active ? <Flame className="size-3.5" aria-hidden /> : '·'}
              </span>
            </div>
          )
        })}
      </div>
    </header>
  )
}
