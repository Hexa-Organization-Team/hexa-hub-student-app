'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, LockKeyhole, Mail, Sparkles, UserRound, Globe, GitBranch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/src/lib/supabaseClient'

type AuthMode = 'login' | 'register'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('login')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [emailExists, setEmailExists] = useState<boolean | null>(null)

  const checkEmailExists = async (emailToCheck: string) => {
    if (!emailToCheck) {
      setEmailExists(null)
      return
    }

    setCheckingEmail(true)
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToCheck }),
      })

      const data = await response.json()
      setEmailExists(data.exists)
    } catch (err) {
      setEmailExists(null)
    } finally {
      setCheckingEmail(false)
    }
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    // Debounce email check
    const timer = setTimeout(() => {
      if (value) checkEmailExists(value)
    }, 500)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'register') {
        const trimmedFirstName = firstName.trim()
        const trimmedLastName = lastName.trim()

        if (!trimmedFirstName || !trimmedLastName) {
          throw new Error('Inserisci nome e cognome per continuare.')
        }

        if (emailExists === true) {
          setError('Questo account esiste già. Accedi invece.')
          setMode('login')
          setLoading(false)
          return
        }

        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: trimmedFirstName,
              last_name: trimmedLastName,
              full_name: `${trimmedFirstName} ${trimmedLastName}`,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        })

        if (authError) {
          if (authError.message.includes('already registered')) {
            setEmailExists(true)
            setError('Questo account esiste già. Accedi invece.')
            setMode('login')
            setLoading(false)
            return
          }
          throw authError
        }

        if (data.session) {
          router.replace('/')
          return
        }

        if (data.user && !data.session) {
          setMessage('Registrazione completata: controlla la tua email per confermare l’account.')
          return
        }
      }

      if (mode === 'login') {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (authError) {
          if (authError.message.includes('Invalid login credentials')) {
            setEmailExists(false)
            setError('Account non trovato. Registrati invece.')
            setMode('register')
            setLoading(false)
            return
          }
          throw authError
        }

        if (data.session || data.user) {
          router.replace('/')
        }
      }
    } catch (submitError) {
      const messageText =
        submitError instanceof Error
          ? submitError.message
          : 'Si è verificato un errore durante l’accesso.'
      setError(messageText)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams:
            provider === 'google'
              ? {
                  access_type: 'offline',
                  prompt: 'consent',
                }
              : undefined,
        },
      })

      if (authError) {
        throw authError
      }
    } catch (submitError) {
      const messageText =
        submitError instanceof Error
          ? submitError.message
          : 'Si è verificato un errore durante l’accesso con il provider.'
      setError(messageText)
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.2),transparent_30%),linear-gradient(135deg,#120f1d_0%,#181826_50%,#120f1d_100%)] px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-border bg-card/75 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-transparent px-6 pb-5 pt-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Hexa Hub</p>
              <h1 className="font-display text-2xl font-semibold">Benvenuto</h1>
            </div>
          </div>

          <div className="inline-flex rounded-full border border-border bg-background/60 p-1">
            {(['login', 'register'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={[
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  mode === item ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground',
                ].join(' ')}
              >
                {item === 'login' ? 'Accedi' : 'Registrati'}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          {mode === 'register' && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm text-muted-foreground">Nome</label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    required={mode === 'register'}
                    placeholder="Mario"
                    className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none ring-ring/50 transition focus:ring-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-muted-foreground">Cognome</label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    required={mode === 'register'}
                    placeholder="Rossi"
                    className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none ring-ring/50 transition focus:ring-2"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm text-muted-foreground">Email</label>
              {checkingEmail && <span className="text-xs text-muted-foreground animate-pulse">Verifica in corso...</span>}
              {emailExists !== null && !checkingEmail && (
                <span className={`text-xs ${emailExists ? 'text-destructive' : 'text-emerald-500'}`}>
                  {emailExists ? 'Account trovato' : 'Non registrato'}
                </span>
              )}
            </div>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(event) => handleEmailChange(event.target.value)}
                autoComplete="email"
                required
                placeholder="tuo@email.com"
                className={`w-full rounded-xl border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none ring-ring/50 transition focus:ring-2 ${
                  emailExists === true && mode === 'register'
                    ? 'border-destructive/50'
                    : emailExists === false && mode === 'login'
                      ? 'border-destructive/50'
                      : 'border-input'
                }`}
              />
            </div>
            {emailExists === true && mode === 'register' && (
              <p className="text-xs text-muted-foreground">
                Questo account esiste già.{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login')
                    setError(null)
                    setPassword('')
                  }}
                  className="font-medium text-primary hover:underline"
                >
                  Accedi qui
                </button>
              </p>
            )}
            {emailExists === false && mode === 'login' && (
              <p className="text-xs text-muted-foreground">
                Non hai un account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register')
                    setError(null)
                    setPassword('')
                  }}
                  className="font-medium text-primary hover:underline"
                >
                  Registrati qui
                </button>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-muted-foreground">Password</label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none ring-ring/50 transition focus:ring-2"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive space-y-2">
              <p>{error}</p>
            </div>
          )}

          {message && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {message}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full gap-2 rounded-xl text-base">
            {loading
              ? mode === 'login'
                ? 'Accesso in corso...'
                : 'Registrazione in corso...'
              : mode === 'login'
                ? 'Accedi'
                : 'Crea account'}
            {!loading && <ArrowRight className="size-4" />}
          </Button>
        </form>

        <div className="px-6 pb-6">
          <div className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            oppure
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="w-full justify-center gap-2 rounded-xl border-border bg-background"
            >
              <Globe className="size-4" />
              Continua con Google
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('github')}
              disabled={loading}
              className="w-full justify-center gap-2 rounded-xl border-border bg-background"
            >
              <GitBranch className="size-4" />
              Continua con GitHub
            </Button>
          </div>
        </div>

        <div className="border-t border-border px-6 py-4 text-center text-sm text-muted-foreground">
          Torna alla{' '}
          <Link href="/" className="font-medium text-primary hover:underline">
            dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}
