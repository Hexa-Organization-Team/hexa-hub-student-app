'use client'

import { useMemo, useState, useEffect } from 'react'
import { AiRemindersCard } from '@/components/ai-reminders-card'
import { PlannerHeader } from '@/components/planner-header'
import { TaskList } from '@/components/task-list'
import { initialTasks } from '@/lib/planner-data'
import Navbar from '@/src/components/Navbar'
import { ReminderList } from '@/src/components/ReminderList'
import { GradesList } from '@/src/components/GradesList'
import QuickActionButton from '@/src/components/QuickActionButton'
import { BookOpen, CheckCircle2, Clock } from 'lucide-react'
import { supabase } from '@/src/lib/supabaseClient'

export default function Page() {
  const [tasks, setTasks] = useState(initialTasks)
  const [remindersCount, setRemindersCount] = useState(0)
  const [gradesAverage, setGradesAverage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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

  // Load reminders count and grades average
  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        if (!sessionData.session?.user.id) {
          setLoading(false)
          return
        }

        // Get reminders count
        const { data: reminders, error: remindersError } = await supabase
          .from('reminders')
          .select('id')
          .eq('user_id', sessionData.session.user.id)
          .eq('completed', false)

        if (!remindersError) {
          setRemindersCount(reminders?.length || 0)
        }

        // Get grades average
        const { data: grades, error: gradesError } = await supabase
          .from('grades')
          .select('grade')
          .eq('user_id', sessionData.session.user.id)

        if (!gradesError && grades && grades.length > 0) {
          const avg = (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2)
          setGradesAverage(avg)
        }
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <>
      <Navbar />
      <main className="flex min-h-dvh w-full flex-col bg-background">
        {/* Container con padding — pb extra per la barra categorie fissa */}
        <div className="mx-auto w-full max-w-5xl flex-1 px-4 pb-32 pt-6 sm:px-6 lg:px-8">
          {/* Stats Header - 1 colonna mobile, 2-3 desktop */}
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* Grades Average Card */}
            <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <BookOpen className="size-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Media Voti</p>
                  <p className="text-2xl font-bold text-primary">{gradesAverage || '—'}</p>
                </div>
              </div>
            </div>

            {/* Reminders Pending Card */}
            <div className="rounded-2xl border border-border bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600">
                  <Clock className="size-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Promemoria</p>
                  <p className="text-2xl font-bold text-amber-600">{remindersCount}</p>
                </div>
              </div>
            </div>

            {/* Tasks Completion Card */}
            <div className="rounded-2xl border border-border bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-4 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Compiti</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {completed}/{total}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Sidebar */}
            <div className="flex flex-col gap-5 lg:col-span-1">
              <PlannerHeader />
              <AiRemindersCard completed={completed} total={total} />
              <GradesList />
            </div>

            {/* Center Content - Reminders + Tasks */}
            <div className="flex flex-col gap-8 lg:col-span-2">
              <ReminderList />
              <TaskList tasks={tasks} onToggle={toggle} />
            </div>
          </div>
        </div>
      </main>

      {/* Barra categorie fissa in basso */}
      <QuickActionButton />
    </>
  )
}
