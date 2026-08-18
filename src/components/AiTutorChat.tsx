'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Bot, Send, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Message = {
  id: string
  role: 'user' | 'assistant' | 'system'
  text: string
}

const SUGGESTIONS = ['Spiegami un argomento', 'Riassumi appunti', 'Pianifica studio']

export default function AiTutorChat({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoWarning, setDemoWarning] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: 'Ciao! Sono il tuo Tutor AI Hexa. Posso spiegarti argomenti, riassumere appunti o aiutarti a pianificare lo studio. Come posso aiutarti?',
      },
    ])
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(prefilled?: string) {
    const text = (prefilled ?? input).trim()
    if (!text || loading) return

    const userMsg: Message = { id: `user-${Date.now()}`, role: 'user', text }
    const nextMessages = [...messages, userMsg]

    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Errore di rete')
      }

      if (data.warning) setDemoWarning(data.warning)

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: data.reply ?? 'Nessuna risposta disponibile.',
        },
      ])
    } catch (err) {
      const message =
        err instanceof Error && err.message !== 'Errore di rete'
          ? err.message
          : 'Si è verificato un errore. Riprova tra qualche istante.'

      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          text: message,
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex h-[75dvh] flex-col sm:h-[65dvh]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Bot className="size-5" aria-hidden />
          </div>
          <div>
            <div className="font-display text-sm font-semibold">Tutor AI Hexa</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Online
            </div>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi chat"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>

      {demoWarning && (
        <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-200">
          {demoWarning}
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto bg-background/50 px-4 py-4"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn('flex max-w-[88%]', m.role === 'user' ? 'ml-auto justify-end' : 'mr-auto')}
          >
            {m.role === 'assistant' && (
              <div className="mr-2 mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="size-3.5" aria-hidden />
              </div>
            )}
            <div
              className={cn(
                'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                m.role === 'user'
                  ? 'rounded-br-md bg-primary text-primary-foreground'
                  : 'rounded-bl-md bg-card text-foreground ring-1 ring-border',
              )}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="mr-auto flex max-w-[88%] items-start gap-2">
            <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-3.5 animate-pulse" aria-hidden />
            </div>
            <div className="rounded-2xl rounded-bl-md bg-card px-4 py-3 ring-1 ring-border">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span>L&apos;AI sta pensando</span>
                <span className="inline-flex gap-0.5">
                  <span className="size-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <span className="size-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <span className="size-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-card px-4 py-3">
        <div className="mb-2.5 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              disabled={loading}
              onClick={() => sendMessage(s)}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring/50 placeholder:text-muted-foreground focus:ring-2 disabled:opacity-50"
            placeholder="Scrivi un messaggio al Tutor AI..."
            aria-label="Messaggio per il Tutor AI"
          />
          <Button type="submit" disabled={loading || !input.trim()} size="icon" className="size-10 shrink-0 rounded-xl">
            <Send className="size-4" aria-hidden />
            <span className="sr-only">Invia</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
