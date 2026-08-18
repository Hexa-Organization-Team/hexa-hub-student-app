'use client'

import { Check, Clock } from 'lucide-react'
import { categoryMeta, priorityMeta, type Task } from '@/lib/planner-data'

type TaskItemProps = {
  task: Task
  onToggle: (id: string) => void
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  const cat = categoryMeta[task.category]
  const prio = priorityMeta[task.priority]

  return (
    <li>
      <div className="flex items-center gap-3 rounded-2xl bg-card px-3.5 py-3 ring-1 ring-border">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          aria-pressed={task.done}
          aria-label={
            task.done ? `Segna "${task.title}" da fare` : `Completa "${task.title}"`
          }
          className={[
            'flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors',
            task.done
              ? `border-transparent ${cat.dot} text-background`
              : 'border-border text-transparent hover:border-foreground/40',
          ].join(' ')}
        >
          <Check className="size-3.5" strokeWidth={3} aria-hidden />
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={[
              'truncate text-sm font-medium',
              task.done ? 'text-muted-foreground line-through' : 'text-foreground',
            ].join(' ')}
          >
            {task.title}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate">{task.subject}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden />
              {task.time}
            </span>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${prio.className}`}
        >
          {prio.label}
        </span>
      </div>
    </li>
  )
}
