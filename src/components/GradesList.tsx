'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabaseClient'
import { Plus, Trash2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Grade {
  id: string
  user_id: string
  subject: string
  grade: number
  date: string
  created_at: string
}

export function GradesList() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subject, setSubject] = useState('')
  const [gradeValue, setGradeValue] = useState('6')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchGrades()
  }, [])

  const fetchGrades = async () => {
    try {
      setLoading(true)
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session?.user.id) {
        setError('Non autenticato')
        return
      }

      const { data, error: fetchError } = await supabase
        .from('grades')
        .select('*')
        .eq('user_id', sessionData.session.user.id)
        .order('date', { ascending: false })

      if (fetchError) throw fetchError
      setGrades(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento dei voti')
    } finally {
      setLoading(false)
    }
  }

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !gradeValue) {
      setError('Riempi tutti i campi')
      return
    }

    try {
      setSubmitting(true)
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session?.user.id) {
        setError('Non autenticato')
        return
      }

      const { error: insertError } = await supabase.from('grades').insert({
        user_id: sessionData.session.user.id,
        subject: subject.trim(),
        grade: parseFloat(gradeValue),
        date: new Date().toISOString().split('T')[0],
      })

      if (insertError) throw insertError

      setSubject('')
      setGradeValue('6')
      await fetchGrades()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel salvataggio del voto')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteGrade = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from('grades').delete().eq('id', id)

      if (deleteError) throw deleteError
      await fetchGrades()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nella cancellazione')
    }
  }

  const average =
    grades.length > 0 ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2) : '0'

  const groupedBySubject = grades.reduce(
    (acc, grade) => {
      if (!acc[grade.subject]) {
        acc[grade.subject] = []
      }
      acc[grade.subject].push(grade)
      return acc
    },
    {} as Record<string, Grade[]>,
  )

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="size-5 text-primary" />
          <h2 className="font-semibold text-foreground">I tuoi Voti</h2>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1">
          <span className="text-sm font-medium text-primary">Media:</span>
          <span className="font-bold text-primary">{average}</span>
        </div>
      </div>

      <form onSubmit={handleAddGrade} className="space-y-3 rounded-xl border border-border bg-background/50 p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Materia</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Es. Matematica"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring/50 transition focus:ring-2"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Voto (1-10)</label>
            <input
              type="number"
              min="1"
              max="10"
              step="0.5"
              value={gradeValue}
              onChange={(e) => setGradeValue(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring/50 transition focus:ring-2"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">&nbsp;</label>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="size-4" />
              {submitting ? 'Salvataggio...' : 'Aggiungi'}
            </Button>
          </div>
        </div>
      </form>

      {error && <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">Caricamento voti...</div>
      ) : grades.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">Nessun voto registrato. Aggiungi il tuo primo voto!</div>
      ) : (
        <div className="space-y-3">
          {Object.entries(groupedBySubject).map(([subj, subjectGrades]) => (
            <div key={subj} className="space-y-2 rounded-lg border border-border/50 bg-background/30 p-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">{subj}</h3>
                <span className="text-sm font-semibold text-primary">
                  Media: {(subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length).toFixed(2)}
                </span>
              </div>
              <div className="space-y-2">
                {subjectGrades.map((grade) => (
                  <div key={grade.id} className="flex items-center justify-between rounded-lg bg-background/60 p-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <span className="font-bold">{grade.grade}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-foreground">{grade.grade}/10</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(grade.date).toLocaleDateString('it-IT')}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteGrade(grade.id)}
                      className="text-muted-foreground transition hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
