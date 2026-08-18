'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { CalendarDays, Check, Circle, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { supabase } from '@/src/lib/supabaseClient'

type Reminder = {
  id: string
  user_id: string
  title: string
  description: string | null
  due_date: string | null
  completed: boolean
  created_at: string
}

export function ReminderList() {
  const [userId, setUserId] = useState<string | null>(null)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
  })

  const fetchReminders = useCallback(async (currentUserId: string) => {
    const { data, error: fetchError } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', currentUserId)
      .order('created_at', { ascending: false })

    if (fetchError) {
      throw fetchError
    }

    setReminders(data ?? [])
  }, [])

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!isMounted) return

        if (!user) {
          setUserId(null)
          setReminders([])
          setLoading(false)
          return
        }

        setUserId(user.id)
        await fetchReminders(user.id)
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Impossibile caricare i promemoria.',
          )
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return
      if (!session?.user) {
        setUserId(null)
        setReminders([])
        setLoading(false)
        return
      }

      setUserId(session.user.id)
      setLoading(true)
      try {
        await fetchReminders(session.user.id)
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Impossibile aggiornare i promemoria.',
        )
      } finally {
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchReminders])

  const submitReminder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!userId) {
      setError('Devi accedere per creare un promemoria.')
      return
    }

    const title = form.title.trim()
    if (!title) {
      setError('Inserisci un titolo per il promemoria.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        user_id: userId,
        title,
        description: form.description.trim() || null,
        due_date: form.date ? new Date(`${form.date}T12:00:00`).toISOString() : null,
        completed: false,
      }

      const { data, error: insertError } = await supabase
        .from('reminders')
        .insert([payload])
        .select()

      if (insertError) {
        throw insertError
      }

      setReminders((current) => [data?.[0] ?? payload, ...current])
      setForm({ title: '', description: '', date: '' })
    } catch (insertError) {
      setError(
        insertError instanceof Error
          ? insertError.message
          : 'Non è stato possibile salvare il promemoria.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggle = async (reminder: Reminder) => {
    if (!userId) return

    try {
      const { error: updateError } = await supabase
        .from('reminders')
        .update({ completed: !reminder.completed })
        .eq('id', reminder.id)

      if (updateError) {
        throw updateError
      }

      setReminders((current) =>
        current.map((item) =>
          item.id === reminder.id ? { ...item, completed: !item.completed } : item,
        ),
      )
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Non è stato possibile aggiornare il promemoria.',
      )
    }
  }

  const handleDelete = async (reminderId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('reminders')
        .delete()
        .eq('id', reminderId)

      if (deleteError) {
        throw deleteError
      }

      setReminders((current) => current.filter((item) => item.id !== reminderId))
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Non è stato possibile eliminare il promemoria.',
      )
    }
  }

  return (
    <section className="rounded-[28px] border border-border bg-card p-4 shadow-xl shadow-black/10 sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Promemoria
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold">I tuoi appuntamenti</h2>
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <CalendarDays className="size-5" />
        </div>
      </div>

      {!userId ? (
        <div className="rounded-2xl border border-dashed border-border bg-background/70 p-5 text-sm text-muted-foreground">
          Accedi per vedere e gestire i tuoi promemoria.
        </div>
      ) : (
        <>
          <form onSubmit={submitReminder} className="mb-5 space-y-3 rounded-2xl border border-border bg-background/60 p-4">
            <div className="grid gap-3 md:grid-cols-[1.5fr_1fr]">
              <label className="space-y-1.5 text-sm">
                <span className="text-muted-foreground">Titolo</span>
                <input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Ripasso di matematica"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-ring/40 transition focus:ring-2"
                />
              </label>

              <label className="space-y-1.5 text-sm">
                <span className="text-muted-foreground">Data</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-ring/40 transition focus:ring-2"
                />
              </label>
            </div>

            <label className="block space-y-1.5 text-sm">
              <span className="text-muted-foreground">Descrizione</span>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Ripassare integrali e riepilogo dei temi principali..."
                rows={3}
                className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-ring/40 transition focus:ring-2"
              />
            </label>

            <div className="flex items-center justify-between gap-3">
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                disabled={submitting}
                className="ml-auto gap-2 rounded-xl"
              >
                <Plus className="size-4" />
                {submitting ? 'Salvataggio...' : 'Aggiungi promemoria'}
              </Button>
            </div>
          </form>

          <div className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="h-20 animate-pulse rounded-2xl bg-muted/70"
                  />
                ))}
              </div>
            ) : reminders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-background/70 p-5 text-sm text-muted-foreground">
                Nessun promemoria creato. Aggiungine uno per iniziare.
              </div>
            ) : (
              reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={cn(
                    'flex items-start gap-3 rounded-2xl border p-3 transition-colors',
                    reminder.completed
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : 'border-border bg-background/70',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(reminder)}
                    className={cn(
                      'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors',
                      reminder.completed
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/80 hover:text-primary',
                    )}
                    aria-label={reminder.completed ? 'Segna come non completato' : 'Segna come completato'}
                  >
                    {reminder.completed ? <Check className="size-4" /> : <Circle className="size-4" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className={cn('font-medium', reminder.completed && 'line-through opacity-70')}>
                      {reminder.title}
                    </p>
                    {reminder.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{reminder.description}</p>
                    )}
                    {reminder.due_date && (
                      <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-2 py-1 text-[11px] text-secondary-foreground">
                        <CalendarDays className="size-3" />
                        {new Date(reminder.due_date).toLocaleDateString('it-IT', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(reminder.id)}
                    className="mt-0.5 rounded-full p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Elimina promemoria"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </section>
  )
}
