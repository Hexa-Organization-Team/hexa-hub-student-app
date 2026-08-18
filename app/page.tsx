'use client'

import { useMemo, useState } from 'react'
import { AiRemindersCard } from '@/components/ai-reminders-card'
import { PlannerHeader } from '@/components/planner-header'
import { TaskList } from '@/components/task-list'
import { initialTasks } from '@/lib/planner-data'
import QuickActionButton from '@/src/components/QuickActionButton'

export default function Page() {
  const [tasks, setTasks] = useState(initialTasks)

  const toggle = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )

  const { completed, total } = useMemo(() => {
    const study = tasks.filter((t) => t.category === 'study')
    return {
      completed: study.filter((t) => t.done).length,
      total: study.length,
    }
  }, [tasks])

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-5 pb-8 pt-8">
      <QuickActionButton />
      <PlannerHeader />
      <AiRemindersCard completed={completed} total={total} />
      <TaskList tasks={tasks} onToggle={toggle} />
    </main>
  )
}
