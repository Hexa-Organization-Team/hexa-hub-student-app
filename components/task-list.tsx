'use client'

import { categoryMeta, type Category, type Task } from '@/lib/planner-data'
import { TaskItem } from './task-item'

type TaskListProps = {
  tasks: Task[]
  onToggle: (id: string) => void
}

const order: Category[] = ['study', 'exam', 'social']

export function TaskList({ tasks, onToggle }: TaskListProps) {
  return (
    <div className="flex flex-col gap-6">
      {order.map((category) => {
        const items = tasks.filter((t) => t.category === category)
        if (items.length === 0) return null
        const meta = categoryMeta[category]
        const doneCount = items.filter((t) => t.done).length

        return (
          <section key={category} aria-labelledby={`section-${category}`}>
            <div className="mb-2.5 flex items-center gap-2 px-1">
              <span className={`size-2.5 rounded-full ${meta.dot}`} aria-hidden />
              <h3
                id={`section-${category}`}
                className="font-display text-sm font-semibold"
              >
                {meta.label}
              </h3>
              <span className="text-xs text-muted-foreground">
                {doneCount}/{items.length}
              </span>
            </div>
            <ul className="flex flex-col gap-2">
              {items.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={onToggle} />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
