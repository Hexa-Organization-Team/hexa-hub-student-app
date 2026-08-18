'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LogOut, UserCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/src/lib/supabaseClient'

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const getDisplayName = (sessionUser: any) => {
    const metadata = sessionUser?.user_metadata ?? {}
    const fullName =
      metadata.full_name ||
      [metadata.first_name, metadata.last_name].filter(Boolean).join(' ') ||
      sessionUser?.email?.split('@')[0] ||
      'Utente'

    return fullName
  }

  useEffect(() => {
    let isMounted = true

    const syncSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!isMounted) return
      setUserName(session ? getDisplayName(session.user) : null)
      setLoading(false)
    }

    syncSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return
      setUserName(session ? getDisplayName(session.user) : null)
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserName(null)
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-sm shadow-primary/20">
            <span className="font-display text-sm font-bold">H</span>
          </div>
          <div>
            <p className="font-display text-base font-semibold tracking-tight">Hexa Hub</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Student planner</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
          ) : userName ? (
            <div className="flex items-center gap-3 rounded-full border border-border bg-card px-2 py-1.5 shadow-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                <UserCircle2 className="size-5" />
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs text-muted-foreground">Account</p>
                <p className="max-w-[180px] truncate text-sm font-medium">{userName}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 rounded-full"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Disconnetti</span>
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button type="button" className="rounded-full px-5">Accedi</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
