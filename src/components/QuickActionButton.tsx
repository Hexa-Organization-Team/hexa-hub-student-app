'use client'

import React, { useState } from 'react'
import {
  FileText,
  Calendar,
  Bot,
  Bell,
  type LucideIcon,
} from 'lucide-react'
import AiTutorChat from './AiTutorChat'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ModalType = 'note' | 'event' | 'chat' | 'reminder'

const categories: {
  id: ModalType
  label: string
  short: string
  description: string
  emoji: string
  icon: LucideIcon
  accent: string
}[] = [
  {
    id: 'note',
    label: 'Nuova Nota',
    short: 'Nota',
    description: 'Appunti e idee',
    emoji: '📝',
    icon: FileText,
    accent: 'bg-study/15 text-study',
  },
  {
    id: 'event',
    label: 'Evento / Esame',
    short: 'Evento',
    description: 'Calendario scolastico',
    emoji: '📅',
    icon: Calendar,
    accent: 'bg-exam/15 text-exam',
  },
  {
    id: 'chat',
    label: 'Tutor AI',
    short: 'Tutor',
    description: 'Chiedi assistenza',
    emoji: '🤖',
    icon: Bot,
    accent: 'bg-primary/15 text-primary',
  },
  {
    id: 'reminder',
    label: 'Promemoria',
    short: 'Promemoria',
    description: 'Avvisi e scadenze',
    emoji: '⏰',
    icon: Bell,
    accent: 'bg-social/15 text-social',
  },
]

export default function QuickActionButton() {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null)

  function openModal(modal: ModalType) {
    setActiveModal(modal)
  }

  return (
    <>
      {/* Barra categorie fissa in basso */}
      <nav
        aria-label="Categorie azioni rapide"
        className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2"
      >
        <div className="flex w-full max-w-md items-stretch justify-around gap-1 rounded-2xl border border-border bg-card/95 p-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl">
          {categories.map(({ id, short, label, icon: Icon, accent }) => {
            const isActive = activeModal === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => openModal(id)}
                aria-label={label}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground',
                  isActive && 'bg-secondary/70 text-foreground',
                )}
              >
                <span className={cn('flex size-9 items-center justify-center rounded-xl', accent)}>
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="text-[10px] font-medium leading-none sm:text-xs">{short}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {activeModal === 'note' && (
        <SimpleModal title="📝 Nuova Nota" onClose={() => setActiveModal(null)}>
          <p className="text-sm text-muted-foreground">
            Scrivi un appunto rapido da consultare in seguito.
          </p>
          <textarea
            className="mt-3 w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring/50 focus:ring-2"
            rows={6}
            placeholder="Scrivi la nota..."
          />
          <div className="mt-4 flex justify-end">
            <Button type="button">Salva</Button>
          </div>
        </SimpleModal>
      )}

      {activeModal === 'event' && (
        <SimpleModal title="📅 Aggiungi Evento/Esame" onClose={() => setActiveModal(null)}>
          <p className="text-sm text-muted-foreground">
            Aggiungi un evento o una data d&apos;esame al calendario.
          </p>
          <input
            type="text"
            className="mt-3 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring/50 focus:ring-2"
            placeholder="Titolo evento"
          />
          <input
            type="datetime-local"
            className="mt-3 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring/50 focus:ring-2"
          />
          <div className="mt-4 flex justify-end">
            <Button type="button">Aggiungi</Button>
          </div>
        </SimpleModal>
      )}

      {activeModal === 'reminder' && (
        <SimpleModal title="⏰ Nuovo Promemoria" onClose={() => setActiveModal(null)}>
          <p className="text-sm text-muted-foreground">
            Imposta un promemoria per non dimenticare i tuoi obiettivi.
          </p>
          <input
            type="text"
            className="mt-3 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring/50 focus:ring-2"
            placeholder="Descrizione promemoria"
          />
          <input
            type="datetime-local"
            className="mt-3 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring/50 focus:ring-2"
          />
          <div className="mt-4 flex justify-end">
            <Button type="button">Crea</Button>
          </div>
        </SimpleModal>
      )}

      {activeModal === 'chat' && (
        <SimpleModal title="" onClose={() => setActiveModal(null)} wide hideHeader>
          <AiTutorChat onClose={() => setActiveModal(null)} />
        </SimpleModal>
      )}
    </>
  )
}

function SimpleModal({
  title,
  children,
  onClose,
  wide,
  hideHeader,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
  wide?: boolean
  hideHeader?: boolean
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Dialog'}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-2xl bg-card shadow-2xl ring-1 ring-border',
          wide ? 'max-w-4xl' : 'max-w-lg',
        )}
      >
        {!hideHeader && (
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Chiudi
            </button>
          </div>
        )}
        <div className={cn('overflow-y-auto', hideHeader ? '' : 'p-5')}>{children}</div>
      </div>
    </div>
  )
}
