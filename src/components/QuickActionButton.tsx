'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  FileText,
  Calendar,
  Bot,
  Bell,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react'
import AiTutorChat from './AiTutorChat'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ModalType = 'note' | 'event' | 'chat' | 'reminder'

const categories: {
  id: ModalType
  label: string
  description: string
  emoji: string
  icon: LucideIcon
  accent: string
}[] = [
  {
    id: 'note',
    label: 'Nuova Nota',
    description: 'Appunti e idee',
    emoji: '📝',
    icon: FileText,
    accent: 'bg-study/15 text-study',
  },
  {
    id: 'event',
    label: 'Evento / Esame',
    description: 'Calendario scolastico',
    emoji: '📅',
    icon: Calendar,
    accent: 'bg-exam/15 text-exam',
  },
  {
    id: 'chat',
    label: 'Tutor AI',
    description: 'Chiedi assistenza',
    emoji: '🤖',
    icon: Bot,
    accent: 'bg-primary/15 text-primary',
  },
  {
    id: 'reminder',
    label: 'Promemoria',
    description: 'Avvisi e scadenze',
    emoji: '⏰',
    icon: Bell,
    accent: 'bg-social/15 text-social',
  },
]

export default function QuickActionButton() {
  const [open, setOpen] = useState(false)
  const [activeModal, setActiveModal] = useState<ModalType | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  function openModal(modal: ModalType) {
    setActiveModal(modal)
    setOpen(false)
  }

  return (
    <>
      <div ref={menuRef} className="relative self-start">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="Apri menu categorie"
          className={cn(
            'flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-sm font-medium ring-1 ring-border transition-colors hover:bg-secondary',
            open && 'bg-secondary',
          )}
        >
          <LayoutGrid className="size-4 text-primary" aria-hidden />
          <span>Categorie</span>
          <ChevronDown
            className={cn('size-4 text-muted-foreground transition-transform duration-200', open && 'rotate-180')}
            aria-hidden
          />
        </button>

        <div
          role="menu"
          aria-label="Categorie azioni rapide"
          className={cn(
            'absolute left-0 top-full z-40 mt-2 w-64 origin-top-left overflow-hidden rounded-2xl bg-card shadow-xl ring-1 ring-border transition-all duration-200',
            open
              ? 'pointer-events-auto scale-100 opacity-100'
              : 'pointer-events-none scale-95 opacity-0',
          )}
        >
          <div className="border-b border-border px-3 py-2.5">
            <p className="text-xs font-medium text-muted-foreground">Azioni rapide</p>
          </div>
          <div className="p-1.5">
            {categories.map(({ id, label, description, emoji, icon: Icon, accent }) => (
              <button
                key={id}
                type="button"
                role="menuitem"
                onClick={() => openModal(id)}
                className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-secondary"
              >
                <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-xl', accent)}>
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <span aria-hidden>{emoji}</span>
                    {label}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

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
